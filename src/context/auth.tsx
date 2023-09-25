import React, { useState, createContext, useMemo, useEffect } from "react";
import { useRouter } from "next/router";

// Create the context
export const AuthContext = createContext<any>({});

// Define the user object type
interface User {
  token: string;
  name: string;
  expires: number;
}

interface Users {
  username: string;
  password: string;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

// Define the server information object
const serverInfo: any = {
  server: "https://opencity.vplanas.lt/",
  tokenServiceUrl: "https://opencity.vplanas.lt/sharing/generateToken",
};

const serviceUrl =
  "https://opencity.vplanas.lt/arcgis/rest/services/P_Vaiku_ugdymas/Vaiku_ugdymas_edit/FeatureServer/0";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    token: "",
    name: "",
    expires: 0,
  });

  const importIdentifyManager = useMemo(async () => {
    const esriId = (await import("@arcgis/core/identity/IdentityManager.js"))
      .default;
    return esriId;
  }, []);

  const login = async (users: Users) => {
    const esriId = await importIdentifyManager;
    esriId.tokenValidity = 720;

    esriId.generateToken(serverInfo, users).then((response) => {
      response.server = serverInfo.server;
      response.userId = users.username;
      esriId.registerToken(response);
      const token = response.token;
      const name = response.userId;
      const expires = response.expires;
      setUser({ token, name, expires });
      localStorage.setItem(
        "item",
        JSON.stringify({
          token,
          name,
          expires,
        })
      );
      router.push("/zemelapis");
    });
  };

  const logout = async () => {
    const esriId = await importIdentifyManager;
    esriId.destroyCredentials();
    localStorage.removeItem("item");
    setUser({
      token: "",
      name: "",
      expires: 0,
    });
    window.location.reload();
  };

  const loadUserFromLocalStorage = async () => {
    const esriId = await importIdentifyManager;
    const token = JSON.parse(localStorage.getItem("item") || "{}");

    if (token.token && token.expires > Date.now()) {
      esriId.registerToken({
        token: token.token,
        server: serviceUrl,
        expires: token.expires,
      });

      esriId.checkSignInStatus(serviceUrl).then((res) => {
        setUser(
          { token: res.token, name: token.name, expires: token.expires } || {
            token: "",
            name: "",
            expires: 0,
          }
        );
      });
    } else {
      localStorage.removeItem("item");
      setUser({
        token: "",
        name: "",
        expires: 0,
      });
    }
  };

  useEffect(() => {
    loadUserFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
