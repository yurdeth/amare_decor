// Format currency to US Dollar format
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date to readable Spanish format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-MX', options);
}

// Format date to short format (e.g., "15 May")
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  return date.toLocaleDateString('es-MX', options);
}

// Format date to include time
export function formatDateWithTime(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('es-MX', options);
}

// Format phone number to Mexican format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if the number has the correct length for Mexican numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  // If it has country code
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return `+52 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }

  return phone; // Return original if format doesn't match
}

// Get status color for badges
export function getStatusColor(status: string): string {
  const statusColors: { [key: string]: string } = {
    available: 'bg-available/80 text-white',
    'in-use': 'bg-in-use/80 text-white',
    maintenance: 'bg-maintenance/80 text-white',
    pending: 'bg-yellow-400/80 text-white',
    confirmed: 'bg-available/80 text-white',
    completed: 'bg-primary/80 text-white',
    cancelled: 'bg-red-400/80 text-white',
  };

  return statusColors[status] || 'bg-gray-400/80 text-white';
}

// Get status label in Spanish
export function getStatusLabel(status: string): string {
  const statusLabels: { [key: string]: string } = {
    available: 'Disponible',
    'in-use': 'En uso',
    maintenance: 'Mantenimiento',
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };

  return statusLabels[status] || status;
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get initial letters from name
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Format relative time (e.g., "hace 2 días")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
  return `Hace ${Math.floor(diffInDays / 365)} años`;
}
