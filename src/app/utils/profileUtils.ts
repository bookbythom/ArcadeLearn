// Rozhranie profilu pouzivatela
export interface UserProfile {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
}

// Validacia emailu
export function validateEmail(email: string): { valid: boolean; error?: string } {
  // Prazdny email
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  // Musi obsahovat @
  let hasAt = false;
  for (let i = 0; i < email.length; i++) {
    if (email[i] === '@') {
      hasAt = true;
      break;
    }
  }
  
  if (!hasAt) {
    return { valid: false, error: 'Email must contain @ symbol' };
  }

  // Kontrola povolených znakov
  const allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789@._-';
  for (let i = 0; i < email.length; i++) {
    let char = email[i];
    let isAllowed = false;
    
    for (let j = 0; j < allowedChars.length; j++) {
      if (char === allowedChars[j]) {
        isAllowed = true;
        break;
      }
    }
    
    if (!isAllowed) {
      return { valid: false, error: 'Email can only contain lowercase letters, numbers, @, ., _, and -' };
    }
  }

  // Zakladna validacia formatu
  const emailRegex = /^[a-z0-9][a-z0-9._-]*@[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address (e.g., user@example.com)' };
  }

  return { valid: true };
}

// Validacia hesla
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  // Minimalna dlzka
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  // Nesmie obsahovat medzery
  let hasSpace = false;
  for (let i = 0; i < password.length; i++) {
    if (password[i] === ' ') {
      hasSpace = true;
      break;
    }
  }
  
  if (hasSpace) {
    return { valid: false, error: 'Password cannot contain spaces' };
  }

  return { valid: true };
}

// Validacia mena
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }
  
  let trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }

  if (trimmedName.length > 25) {
    return { valid: false, error: 'Name must not exceed 25 characters' };
  }

  return { valid: true };
}

// Konverzia obrazku na base64
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Nastavenia pre kompresi
    const maxWidth = 400;
    const maxHeight = 400;
    const quality = 0.85;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    // Kontrola velkosti
    if (file.size > maxSize) {
      reject(new Error('Image file is too large. Please choose an image under 10MB.'));
      return;
    }
    
    // Citanie suboru
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Canvas pre zmenu velkosti
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        
        // Prepocet rozmeru
        if (w > h) {
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
        } else {
          if (h > maxHeight) {
            w = Math.round((w * maxHeight) / h);
            h = maxHeight;
          }
        }
        
        // Nastavenie rozmeru canvas
        canvas.width = w;
        canvas.height = h;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Vykreslenie obrazku
        ctx.drawImage(img, 0, 0, w, h);
        
        // Konverzia na base64
        const base64String = canvas.toDataURL('image/jpeg', quality);
        
        // Upozornenie ak je stale velky
        if (base64String.length > 200000) {
          console.warn('[WARNING] Compressed image is still large:', Math.round(base64String.length / 1024), 'KB');
        }
        
        resolve(base64String);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(reader.error);
    };
    
    reader.readAsDataURL(file);
  });
}
