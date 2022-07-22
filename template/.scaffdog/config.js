module.exports = {
  files: ["./*"],
  helpers: [
    (registry) => {
      registry.set("plur", (_context, value, _size, _str) => {
        return plur(value);
      });

      registry.set("newFormDefaultValues", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            return `${name}: ""`;
          }

          if (type == "number") {
            return `${name}: 0`;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`,\n`);
      });

      registry.set("editFormDefaultValues", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            return `${name}: item.${name}`;
          }

          if (type == "number") {
            return `${name}: item.${name}`;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`,\n`);
      });

      registry.set("forms", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            const tag = `<FormInput
                t={t}
                form={form}
                name="${name}"
                type="text"
                label="${name}"
                required
              />`;

            return tag;
          }

          if (type == "number") {
            const tag = `<FormInput
                t={t}
                form={form}
                name="${name}"
                type="number"
                label="${name}"
                required
                valueAsNumber
              />`;

            return tag;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`\n`);
      });

      registry.set("graphqlSchemas", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            return `${name}: String!`;
          }

          if (type == "number") {
            return `${name}: Int!`;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`\n`);
      });

      registry.set("graphqlFragmentSchemas", (_context, value, _size, _str) => {
        const values = (name, type) => {
          return `${name}`;
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`\n`);
      });

      registry.set("prismaSchemas", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            return `${name} String`;
          }

          if (type == "number") {
            return `${name} Int`;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`\n`);
      });

      registry.set("findSchemas", (_context, value, _size, _str) => {
        const values = (name) => {
          return `${name}:  findData.${name},`;
        };

        const attributes = value.split(",").map((line) => {
          const [name] = line.split(":");
          return `${values(name.trim())}`;
        });

        return attributes.join(`\n`);
      });

      registry.set("saveSchemas", (_context, value, _size, _str) => {
        const values = (name, type) => {
          if (type == "string") {
            return `${name}:  args.input.${name},`;
          }

          if (type == "number") {
            return `${name}:  args.input.${name},`;
          }
        };

        const attributes = value.split(",").map((line) => {
          const [name, type] = line.split(":");
          return `${values(name.trim(), type.trim())}`;
        });

        return attributes.join(`\n`);
      });
    },
  ],
};

PLUR_RURLES = {
  pluralRules: {
    "/(s)tatus$/i": 'RegExp.$1+"tatuses"',
    "/^(ox)$/i": 'RegExp.$1+"en"',
    "/([m|l])ouse$/i": 'RegExp.$1+"ice"',
    "/(matr|vert|ind)ix|ex$/i": 'RegExp.$1+"ices"',
    "/(x|ch|ss|sh)$/i": 'RegExp.$1+"es"',
    "/(r|t|c)y$/i": 'RegExp.$1+"ies"',
    "/(hive)$/i": 'RegExp.$1+"s"',
    "/(?:([^f])fe|([lr])f)$/i": 'RegExp.$1+RegExp.$2+"ves"',
    "/(.*)sis$/i": 'RegExp.$1+"ses"',
    "/([ti])um$/i": 'RegExp.$1+"a"',
    "/(buffal|tomat)o$/i": 'RegExp.$1+"oes"',
    "/(bu)s$/i": 'RegExp.$1+"ses"',
    "/(alias)/i": 'RegExp.$1+"es"',
    "/(octop|vir)us$/i": 'RegExp.$1+"i"',
    "/(.*)s$/i": 'RegExp.$1+"s"',
    "/(.*)/i": 'RegExp.$1+"s"',
  },
  uninflected: ["deer", "fish", "measles", "ois", "pox", "rice", "sheep", "Amoyese", "bison", "bream", "buffalo", "cantus", "carp", "cod", "coitus", "corps", "diabetes", "elk", "equipment", "flounder", "gallows", "Genevese", "Gilbertese", "graffiti", "headquarters", "herpes", "information", "innings", "Lucchese", "mackerel", "mews", "moose", "mumps", "news", "nexus", "Niasese", "Pekingese", "Portuguese", "proceedings", "rabies", "salmon", "scissors", "series", "shears", "siemens", "species", "testes", "trousers", "trout", "tuna", "whiting", "wildebeest", "Yengeese"],
  pluralIrregular: {
    atlas: "atlases",
    child: "children",
    corpus: "corpuses",
    ganglion: "ganglions",
    genus: "genera",
    graffito: "graffiti",
    leaf: "leaves",
    man: "men",
    money: "monies",
    mythos: "mythoi",
    numen: "numina",
    opus: "opuses",
    penis: "penises",
    person: "people",
    sex: "sexes",
    soliloquy: "soliloquies",
    testis: "testes",
    woman: "women",
    move: "moves",
  },
  singularIrregular: {
    atlases: "atlas",
    children: "child",
    corpuses: "corpus",
    ganglions: "ganglion",
    genera: "genus",
    graffiti: "graffito",
    leaves: "leaf",
    men: "man",
    monies: "money",
    mythoi: "mythos",
    numina: "numen",
    opuses: "opus",
    penises: "penises",
    people: "person",
    sexes: "sex",
    soliloquies: "soliloquy",
    testes: "testis",
    women: "woman",
    moves: "move",
  },
};

function plur(word) {
  var word = word;

  for (i in PLUR_RURLES["uninflected"]) {
    if (word.toLowerCase() == PLUR_RURLES["uninflected"][i]) {
      return word;
    }
  }

  for (i in PLUR_RURLES["pluralIrregular"]) {
    if (word.toLowerCase() == i) {
      return (word = PLUR_RURLES["pluralIrregular"][i]);
    }
  }

  for (i in PLUR_RURLES["pluralRules"]) {
    try {
      var rObj = eval("new RegExp(" + i + ");");
      if (word.match(rObj)) {
        word = word.replace(rObj, eval(PLUR_RURLES["pluralRules"][i]));
        return word;
      }
    } catch (e) {
      alert(e.description);
    }
  }

  return word;
}
