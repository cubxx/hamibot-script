/**define script config @see https://docs.hamibot.com/guide/tutorial-config */
declare const defineConfig: (
  config: {
    label: string;
    name: string;
    placeholder?: string;
    help?: string;
    type?: 'textarea' | 'range' | 'radio' | 'checkbox' | 'select';
    validation?: 'required';
    'validation-name'?: string;
    options?: Record<string, string>;
    'show-value'?: true;
    max?: number;
    min?: number;
    step?: number;
  }[],
) => void;
type Primative = string | number | boolean | null | undefined;