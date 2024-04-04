const fs = require('fs');
const hclToJson = require('hcl-to-json');


// create a function that converts JSON to HCL (HashiCorp Configuration Language)
function jsonToHcl(obj, indent = '') {
    let hclString = '';

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                hclString += `${indent}${key} = [\n`;
                for (const item of value) {
                    if (typeof item === 'object' && item !== null) {
                        hclString += `${indent}  jsonencode(\n`;
                        hclString += jsonToHcl(item, indent + '    ');
                        hclString += `${indent}  ),\n`;
                    } else {
                        hclString += `${indent}  ${JSON.stringify(item)},\n`;
                    }
                }
                hclString += `${indent}]\n`;
            } else {
                hclString += `${indent}${key} = {\n`;
                hclString += jsonToHcl(value, indent + '  ');
                hclString += `${indent}}\n`;
            }
        } else {
            if (typeof value === 'string') {
                hclString += `${indent}${key} = "${value}"\n`;
            } else {
                hclString += `${indent}${key} = ${value}\n`;
            }
        }
    }

    return hclString;
}

class HCLEditor {
    constructor(filePath) {
        this.filePath = filePath;
        this.hclContent = fs.readFileSync(filePath, 'utf-8');
        this.jsonContent = hclToJson(this.hclContent);
    }

    save() {
        const newHclContent = jsonToHcl(this.jsonContent);
        fs.writeFileSync(this.filePath, newHclContent, 'utf-8');
    }

    addAttribute(path, value) {
        // path like 'resource.aws_instance.my_instance.ami'
        let ref = this.jsonContent;
        const keys = path.split('.');
        const lastKey = keys.pop();

        for (const key of keys) {
            if (!ref[key]) {
                ref[key] = {};
            }
            ref = ref[key];
        }

        ref[lastKey] = value;
        this.save();
    }

    deleteAttribute(path) {
        let ref = this.jsonContent;
        const keys = path.split('.');
        const lastKey = keys.pop();

        for (const key of keys) {
            if (!ref[key]) {
                return;
            }
            ref = ref[key];
        }

        delete ref[lastKey];
        this.save();
    }

    updateAttribute(path, newValue) {
        this.addAttribute(path, newValue); // addAttribute can also update
    }
}

module.exports = HCLEditor;
