const HCLEditor = require('./index');

const hclEditor = new HCLEditor('new_automation_flow.tf');
hclEditor.addAttribute('resource.epilot-automation_flow.new_automation_flow.test', 'ami-12345');
