  const plugin = {

    // preferred location of name and version
    meta: {
        name: "eslint-custom-rules",
        version: "1"
    },
    rules: {
        "max-nested-for": {
          create(context) {
            let loopDepth = 0;
    
            return {
              ForStatement(node) {
                loopDepth++;
                if (loopDepth > 2) {
                  context.report({
                    node,
                    message: "No puedes tener 3 o mas bucles 'for' anidados."
                  });
                }
              },
              "ForStatement:exit"() {
                loopDepth--;
              }
            };
          }
        },
        "variableNameLength": {
          meta: {
            type: "suggestion",
            docs: {
              description: "Limita la longitud de los nombres de las variables a un máximo de 20 caracteres",
              recommended: false, 
            },
            schema: [
              {
                type: "object",
                properties: {
                  maxLength: {
                    type: "number",
                    default: 20, 
                  },
                  minLength: {
                    type: "number",
                    default: 3, 
                  }
                },
                additionalProperties: false,
              },
            ],
            messages: {
              tooLong: "El nombre de la variable '{{ name }}' tiene más de {{ maxLength }} caracteres. Actualmente tiene {{ length }} caracteres.",
              tooShort: "El nombre de la variable '{{ name }}' tiene menos de {{ minLength }} caracteres. Actualmente tiene {{ length }} caracteres.",
            },
          },
          create(context) {
            const maxLength = context.options[0]?.maxLength; 
            const minLength = context.options[0]?.minLength
            return {
              VariableDeclarator(node) {
                const variableName = node.id.name;
                if (variableName && variableName.length > maxLength) {
                  context.report({
                    node: node.id,
                    messageId: "tooLong",
                    data: {
                      name: variableName,
                      maxLength,
                      length: variableName.length,
                    },
                  });
                }else{
                  if (variableName && (variableName != "i") && (variableName != "j") && (variableName != "k") && variableName.length < minLength){
                    context.report({
                      node: node.id,
                      messageId: "tooShort",
                      data: {
                        name: variableName,
                        minLength,
                        length: variableName.length,
                      },
                    });
                  }
                }
              },
            };
          },
        }
        
      }
};

// for ESM
export default plugin;