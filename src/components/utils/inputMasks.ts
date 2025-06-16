// src/utils/inputMasks.ts
export class InputMasks {
  
    /**
     * Aplica máscara de CNPJ (00.000.000/0000-00)
     */
    static cnpj(value: string): string {
      // Remove tudo que não é dígito
      const cleaned = value.replace(/\D/g, '');
      
      // Limita a 14 dígitos
      const limited = cleaned.substring(0, 14);
      
      // Aplica a máscara progressivamente
      if (limited.length <= 2) return limited;
      if (limited.length <= 5) return `${limited.substring(0, 2)}.${limited.substring(2)}`;
      if (limited.length <= 8) return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5)}`;
      if (limited.length <= 12) return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5, 8)}/${limited.substring(8)}`;
      return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5, 8)}/${limited.substring(8, 12)}-${limited.substring(12)}`;
    }
  
    /**
     * Aplica máscara de telefone brasileiro (00 00000-0000)
     */
    static phone(value: string): string {
      // Remove tudo que não é dígito
      const cleaned = value.replace(/\D/g, '');
      
      // Limita a 11 dígitos
      const limited = cleaned.substring(0, 11);
      
      // Aplica a máscara progressivamente
      if (limited.length <= 2) return limited;
      if (limited.length <= 7) return `${limited.substring(0, 2)} ${limited.substring(2)}`;
      return `${limited.substring(0, 2)} ${limited.substring(2, 7)}-${limited.substring(7)}`;
    }
  
    /**
     * Aplica máscara de CEP (00000-000)
     */
    static zipCode(value: string): string {
      // Remove tudo que não é dígito
      const cleaned = value.replace(/\D/g, '');
      
      // Limita a 8 dígitos
      const limited = cleaned.substring(0, 8);
      
      // Aplica a máscara progressivamente
      if (limited.length <= 5) return limited;
      return `${limited.substring(0, 5)}-${limited.substring(5)}`;
    }
  
    /**
     * Aplica máscara de CPF (000.000.000-00)
     */
    static cpf(value: string): string {
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
      
      if (!match) return value;
      
      let result = '';
      if (match[1]) result += match[1];
      if (match[2]) result += '.' + match[2];
      if (match[3]) result += '.' + match[3];
      if (match[4]) result += '-' + match[4];
      
      return result;
    }
  
    /**
     * Remove caracteres não numéricos (para envio à API)
     */
    static cleanNumeric(value: string): string {
      return value.replace(/\D/g, '');
    }
  
    /**
     * Aplica máscara baseada no tipo de campo
     */
    static applyMask(value: string, maskType: MaskType): string {
      switch (maskType) {
        case 'cnpj':
          return this.cnpj(value);
        case 'cpf':
          return this.cpf(value);
        case 'phone':
          return this.phone(value);
        case 'zipCode':
          return this.zipCode(value);
        default:
          return value;
      }
    }
  }
  
  export type MaskType = 'cnpj' | 'cpf' | 'phone' | 'zipCode';
  
  // src/utils/validators.ts
  export class Validators {
    
    /**
     * Valida CNPJ
     */
    static cnpj(cnpj: string): boolean {
      const cleaned = cnpj.replace(/\D/g, '');
      
      if (cleaned.length !== 14) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cleaned)) return false;
      
      // Validação do primeiro dígito verificador
      let sum = 0;
      let weight = 5;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleaned[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      let remainder = sum % 11;
      let digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      if (parseInt(cleaned[12]) !== digit1) return false;
      
      // Validação do segundo dígito verificador
      sum = 0;
      weight = 6;
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cleaned[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      remainder = sum % 11;
      let digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      return parseInt(cleaned[13]) === digit2;
    }
  
    /**
     * Valida CPF
     */
    static cpf(cpf: string): boolean {
      const cleaned = cpf.replace(/\D/g, '');
      
      if (cleaned.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cleaned)) return false;
      
      // Validação do primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * (10 - i);
      }
      let remainder = sum % 11;
      let digit1 = remainder < 2 ? 0 : 11 - remainder;
      
      if (parseInt(cleaned[9]) !== digit1) return false;
      
      // Validação do segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned[i]) * (11 - i);
      }
      remainder = sum % 11;
      let digit2 = remainder < 2 ? 0 : 11 - remainder;
      
      return parseInt(cleaned[10]) === digit2;
    }
  
    /**
     * Valida telefone brasileiro
     */
    static phone(phone: string): boolean {
      const cleaned = phone.replace(/\D/g, '');
      
      // Aceita telefone fixo (10 dígitos) ou celular (11 dígitos)
      if (cleaned.length < 10 || cleaned.length > 11) return false;
      
      // Verifica se o DDD é válido (11 a 99)
      const ddd = parseInt(cleaned.substring(0, 2));
      if (ddd < 11 || ddd > 99) return false;
      
      // Para celular, o terceiro dígito deve ser 9
      if (cleaned.length === 11 && cleaned[2] !== '9') return false;
      
      return true;
    }
  
    /**
     * Valida CEP
     */
    static zipCode(zipCode: string): boolean {
      const cleaned = zipCode.replace(/\D/g, '');
      return cleaned.length === 8;
    }
  
    /**
     * Valida email
     */
    static email(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    }
  
    /**
     * Valida campo obrigatório
     */
    static required(value: string): boolean {
      return value.trim().length > 0;
    }
  
    /**
     * Valida comprimento mínimo
     */
    static minLength(value: string, min: number): boolean {
      return value.trim().length >= min;
    }
  
    /**
     * Valida comprimento máximo
     */
    static maxLength(value: string, max: number): boolean {
      return value.trim().length <= max;
    }
  }