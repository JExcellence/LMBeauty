const schema = {
    logo: "/images/logo.png",
    type: "Organization",
    name: "LM Beauty",
    title: "LM Beauty: Dein Studio für Wimpern, Kosmetik und Nägel in Oldenburg",
    description:
        "LM Beauty ist ein Studio für Wimpern, Kosmetik und Nägel in Oldenburg.",
    email: "info@lm-beauty.de",
    locale: "de_DE",
};

const meta = {
    home: {
        title: schema.title,
        description: schema.description,
        path: "/",
        image: "/images/og/home.jpg",
    }
};
export { meta, schema };
