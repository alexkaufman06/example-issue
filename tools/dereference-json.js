const $RefParser = require("@apidevtools/json-schema-ref-parser");
const fs = require('fs');
const files = fs.readdirSync('api/');
const yaml = require('js-yaml');
const emoji = require('node-emoji');

function yamlToJSON(filename) {
  return filename.replace('yaml', 'json');
}

function dereferenceToJSON() {
  files.forEach(async (file) => {
    if (file.includes('deprecated')) {
      return;
    }
    const fileContents = fs.readFileSync(`./api/${file}`, 'utf8');
    const mySchema = yaml.load(fileContents);
    const jsonFile = `./api-deref-json/${yamlToJSON(file)}`;
  
    try {
      let clonedSchema = await $RefParser.dereference(mySchema, { mutateInputSchema: false });
      process.stdout.write(`${emoji.get('running_man')} writing to ${jsonFile}`);
      
      fs.writeFileSync(`${jsonFile}`, JSON.stringify(clonedSchema, null, 2), error => {
        if (error) {
          console.error(` ${emoji.get('x')} ${error}`);
          return;
        }
      });

      process.stdout.write(` ${emoji.get('white_check_mark')} \n`);
    } catch (error) {
      console.error(` ${emoji.get('x')} ${error}`);
    }
  });
}

dereferenceToJSON();
