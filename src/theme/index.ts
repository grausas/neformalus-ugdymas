import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "brand.20",
        // bg: "brand.40",
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
      11: "#c2c2c2",
      20: "#f2f4f6",
      21: "#707070",
      30: "#ff8e3c",
      31: "#f15a24",
      40: "#2d334a",
      50: "#272343",
    },
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: "brand.30", // Change this to your desired color
            borderColor: "brand.30",
          },
        },
      },
    },
    Button: {
      baseStyle: {
        rounded: "lg",
        shadow: "sm",
        border: "1px solid",
        borderColor: "brand.11",
      },
    },
  },
});

export default theme;
