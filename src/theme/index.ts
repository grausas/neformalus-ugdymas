import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "brand.20",
        // bg: "brand.40",
        // minHeight: "100vh",
        /* mobile viewport bug fix */
        minHeight: "webkit-fill-available",
        textRendering: "optimizeSpeed",
        lineHeight: "1.5",
      },
      html: {
        minHeight: "webkit-fill-available",
      },
      // styles for the `a`
      a: {
        textDecoration: "none",
        color: "unset",
        // _hover: {
        //   textDecoration: "underline",
        //   color: "brand.31",
        // },
      },
    },
  },
  fonts: {
    body: "var(--font-openSans)",
    heading: "var(--font-openSans)",
  },
  colors: {
    brand: {
      10: "#fffffe",
      11: "#c2c2c2",
      20: "#f2f4f6",
      21: "#707070",
      30: "#ff8e3c",
      31: "#f15a24",
      40: "#343434",
      50: "#211E39",
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
    Switch: {
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
    Input: {
      variants: {
        baseStyle: {
          color: "red",
        },
        outline: {
          field: {
            _focus: {
              borderColor: "brand.21",
              boxShadow: "md",
            },
          },
        },
      },
    },
  },
});

export default theme;
