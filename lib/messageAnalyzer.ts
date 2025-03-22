import { UIComponentAgent } from './uiComponentFunctions';

interface ComponentResult {
  type: string;
  component: string;
}

export class MessageAnalyzer {
  private uiComponentAgent: UIComponentAgent;

  constructor() {
    this.uiComponentAgent = new UIComponentAgent();
  }

  async analyzeMessage(message: string): Promise<ComponentResult | null> {
    // Button detection
    const buttonMatch = message.match(/create\s+a\s+(?:new\s+)?button\s+(?:with|that\s+says)\s+"([^"]+)"/i);
    if (buttonMatch) {
      const result = await this.uiComponentAgent.executeFunction<{ component: string }>({
        name: 'generate_button',
        arguments: {
          label: buttonMatch[1],
          variant: message.includes('outline') ? 'outline' : 
                  message.includes('secondary') ? 'secondary' : 'primary',
          size: message.includes('large') ? 'large' :
                message.includes('small') ? 'small' : 'medium',
        }
      });
      return { type: 'button', component: result.result.component };
    }

    // Input field detection
    const inputMatch = message.match(/create\s+(?:a|an)\s+(?:new\s+)?input\s+(?:field|box)\s+for\s+([a-z]+)/i);
    if (inputMatch) {
      const type = inputMatch[1].toLowerCase();
      const result = await this.uiComponentAgent.executeFunction<{ component: string }>({
        name: 'generate_input',
        arguments: {
          type: type === 'password' || type === 'email' ? type : 'text',
          placeholder: `Enter ${type}...`,
          label: type.charAt(0).toUpperCase() + type.slice(1),
          required: message.includes('required'),
        }
      });
      return { type: 'input', component: result.result.component };
    }

    // Card detection
    const cardMatch = message.match(/create\s+a\s+(?:new\s+)?card\s+with\s+title\s+"([^"]+)"\s+and\s+content\s+"([^"]+)"/i);
    if (cardMatch) {
      const result = await this.uiComponentAgent.executeFunction<{ component: string }>({
        name: 'generate_card',
        arguments: {
          title: cardMatch[1],
          content: cardMatch[2],
          imageUrl: extractImageUrl(message),
        }
      });
      return { type: 'card', component: result.result.component };
    }

    // Form detection
    const formMatch = message.match(/create\s+a\s+(?:new\s+)?form\s+with\s+fields(?:\s+for)?\s+([^"]+)/i);
    if (formMatch) {
      const fieldsText = formMatch[1];
      const fields = parseFormFields(fieldsText);
      const result = await this.uiComponentAgent.executeFunction<{ component: string }>({
        name: 'generate_form',
        arguments: {
          fields,
          submitLabel: extractSubmitLabel(message),
        }
      });
      return { type: 'form', component: result.result.component };
    }

    return null;
  }
}

// Helper functions
function extractImageUrl(message: string): string | undefined {
  const urlMatch = message.match(/(?:image|img|picture)\s+(?:url|src|source|from)\s+"([^"]+)"/i);
  return urlMatch ? urlMatch[1] : undefined;
}

function extractSubmitLabel(message: string): string | undefined {
  const labelMatch = message.match(/submit\s+button\s+(?:saying|with\s+text)\s+"([^"]+)"/i);
  return labelMatch ? labelMatch[1] : undefined;
}

interface FormField {
  type: 'text' | 'number' | 'email' | 'password' | 'select';
  label: string;
  name: string;
  required?: boolean;
  options?: Array<{ label: string; value: string; }>;
}

function parseFormFields(fieldsText: string): FormField[] {
  const fields: FormField[] = [];
  const fieldParts = fieldsText.split(/,\s*|\s+and\s+/);

  for (const part of fieldParts) {
    let type: FormField['type'] = 'text';

    if (part.includes('email')) {
      type = 'email';
    } else if (part.includes('password')) {
      type = 'password';
    } else if (part.includes('number')) {
      type = 'number';
    }

    fields.push({
      type,
      label: part.trim(),
      name: part.trim().toLowerCase().replace(/\s+/g, '_'),
      required: part.includes('required'),
    });
  }

  return fields;
} 