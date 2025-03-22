import { z } from 'zod';
import { BaseFunctionAgent, FunctionDefinition } from './functions';

// Define the supported component types and their properties
const ButtonSchema = z.object({
  label: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  onClick: z.string().optional(),
});

const InputSchema = z.object({
  placeholder: z.string(),
  type: z.enum(['text', 'number', 'email', 'password']),
  label: z.string().optional(),
  required: z.boolean().optional(),
});

const CardSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
  actions: z.array(ButtonSchema).optional(),
});

const FormSchema = z.object({
  fields: z.array(z.object({
    type: z.enum(['text', 'number', 'email', 'password', 'select']),
    label: z.string(),
    name: z.string(),
    required: z.boolean().optional(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  })),
  submitLabel: z.string().optional(),
});

interface ComponentResult {
  component: string;
}

export class UIComponentAgent extends BaseFunctionAgent {
  constructor() {
    super();
    this.registerUIComponents();
  }

  private registerUIComponents() {
    this.registerFunction<ComponentResult>(this.generateButtonFunction);
    this.registerFunction<ComponentResult>(this.generateInputFunction);
    this.registerFunction<ComponentResult>(this.generateCardFunction);
    this.registerFunction<ComponentResult>(this.generateFormFunction);
  }

  protected async executeFunctionImpl<T>(name: string, args: Record<string, unknown>): Promise<T> {
    switch (name) {
      case 'generate_button':
        return this.generateButton(args as z.infer<typeof ButtonSchema>) as T;
      case 'generate_input':
        return this.generateInput(args as z.infer<typeof InputSchema>) as T;
      case 'generate_card':
        return this.generateCard(args as z.infer<typeof CardSchema>) as T;
      case 'generate_form':
        return this.generateForm(args as z.infer<typeof FormSchema>) as T;
      default:
        throw new Error(`Unknown UI component: ${name}`);
    }
  }

  // Component generation implementations
  private generateButton(props: z.infer<typeof ButtonSchema>): ComponentResult {
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    
    return {
      component: `
<button
  className={\`
    px-4 py-2 rounded-lg font-medium transition-colors
    \${${JSON.stringify(this.getButtonStyles(variant))}}
    \${${JSON.stringify(this.getButtonSizeStyles(size))}}
  \`}
  ${props.onClick ? `onClick={${props.onClick}}` : ''}
>
  ${props.label}
</button>`
    };
  }

  private generateInput(props: z.infer<typeof InputSchema>): ComponentResult {
    return {
      component: `
<div className="space-y-2">
  ${props.label ? `<label className="block text-sm font-medium text-gray-700">${props.label}</label>` : ''}
  <input
    type="${props.type}"
    placeholder="${props.placeholder}"
    ${props.required ? 'required' : ''}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>`
    };
  }

  private generateCard(props: z.infer<typeof CardSchema>): ComponentResult {
    return {
      component: `
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  ${props.imageUrl ? `<img src="${props.imageUrl}" alt="${props.title}" className="w-full h-48 object-cover" />` : ''}
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2">${props.title}</h3>
    <p className="text-gray-600">${props.content}</p>
    ${props.actions ? `
    <div className="mt-4 space-x-2">
      ${props.actions.map(action => this.generateButton(action).component).join('\n')}
    </div>` : ''}
  </div>
</div>`
    };
  }

  private generateForm(props: z.infer<typeof FormSchema>): ComponentResult {
    const fields = props.fields.map(field => {
      if (field.type === 'select') {
        return `
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">${field.label}</label>
  <select
    name="${field.name}"
    ${field.required ? 'required' : ''}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    ${field.options?.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
  </select>
</div>`;
      }
      
      return `
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">${field.label}</label>
  <input
    type="${field.type}"
    name="${field.name}"
    ${field.required ? 'required' : ''}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>`;
    }).join('\n');

    return {
      component: `
<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
  ${fields}
  <button
    type="submit"
    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
  >
    ${props.submitLabel || 'Submit'}
  </button>
</form>`
    };
  }

  // Helper methods for styling
  private getButtonStyles(variant: string): string {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'secondary':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      case 'outline':
        return 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600';
    }
  }

  private getButtonSizeStyles(size: string): string {
    switch (size) {
      case 'small':
        return 'text-sm px-3 py-1';
      case 'large':
        return 'text-lg px-6 py-3';
      default:
        return 'text-base px-4 py-2';
    }
  }

  // Function definitions
  private generateButtonFunction: FunctionDefinition<ComponentResult> = {
    name: 'generate_button',
    description: 'Generate a button component with customizable styles',
    parameters: ButtonSchema,
    returnType: { component: '' },
  };

  private generateInputFunction: FunctionDefinition<ComponentResult> = {
    name: 'generate_input',
    description: 'Generate an input field component with label and validation',
    parameters: InputSchema,
    returnType: { component: '' },
  };

  private generateCardFunction: FunctionDefinition<ComponentResult> = {
    name: 'generate_card',
    description: 'Generate a card component with title, content, and optional image',
    parameters: CardSchema,
    returnType: { component: '' },
  };

  private generateFormFunction: FunctionDefinition<ComponentResult> = {
    name: 'generate_form',
    description: 'Generate a form component with multiple fields and validation',
    parameters: FormSchema,
    returnType: { component: '' },
  };
} 