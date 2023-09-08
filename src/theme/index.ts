import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "brand.20",
        minHeight: "100vh",
        textRendering: "optimizeSpeed",
        lineHeight: "1.5",
      },
      // styles for the `a`
      a: {
        color: "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  fonts: {
    body: "var(--font-rubik)",
    heading: "var(--font-rubik)",
  },
  colors: {
    brand: {
      10: "#fffffe",
      20: "#eff0f3",
      30: "#ff8e3c",
      31: "#f15a24",
      40: "#2a2a2a",
      50: "#0d0d0d",
    },
  },
});

export default theme;
