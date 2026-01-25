# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for enhancing the LM Beauty admin interface with modern 2026 design patterns, improved UX/UI components, and advanced scheduling capabilities. The enhancement focuses on creating a premium, mobile-first administrative experience using Once UI components exclusively, maintaining the beauty brand's sophisticated aesthetic while providing professional-grade functionality.

## Architecture

### Component Architecture

```
Admin Interface Enhancement
├── Backend Enhancements
│   ├── CustomerController (endpoint fixes)
│   └── Error Handling (authentication & validation)
├── Frontend Components
│   ├── AvailabilityManager (enhanced with week scheduling)
│   ├── WeekScheduler (new sub-component)
│   ├── AppointmentList (Tag component migration)
│   ├── CalendarView (new modern calendar)
│   └── CustomerDetail (error handling improvements)
└── Styling & Design System
    ├── Once UI Components Integration
    ├── Mobile-First Responsive Design
    └── Premium Beauty Brand Aesthetics
```

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **UI Components**: Once UI System exclusively
- **Styling**: SCSS Modules with Once UI design tokens
- **State Management**: React useState and useEffect hooks
- **Backend**: Spring Boot with Java
- **API Communication**: RESTful endpoints with proper error handling

## Components and Interfaces

### 1. Enhanced AvailabilityManager Component

#### Component Structure
```typescript
interface AvailabilityManagerProps {
  // Existing props maintained for backward compatibility
}

interface WeekSchedule {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  slots: TimeSlot[];
  saved: boolean;
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
```

#### Key Features
- **View Mode Toggle**: Month/Week selection using Once UI Button components
- **Once UI Select Integration**: Replace native HTML selects with Once UI Select components
- **Week Scheduling**: 
  - Dropdown showing next 4 weeks initially
  - "Show More" functionality expanding to 12 weeks
  - Week format: "Diese Woche", "Nächste Woche", "DD.MM - DD.MM"
- **Save Functionality**: 
  - Save button with visual feedback using Once UI Button
  - Status indicators using Once UI Tag components
- **Saved Schedules List**:
  - Card-based layout showing saved week schedules
  - Load functionality to populate current editing interface
  - Show/hide more schedules with smooth animations

#### Implementation Details
```typescript
// Month/Year options for Once UI Select
const monthOptions = monthNames.map((month, index) => ({
  value: index.toString(),
  label: month
}));

const yearOptions = years.map(year => ({
  value: year.toString(),
  label: year.toString()
}));

// Week options generation
const getWeekOptions = () => {
  const options = [];
  const maxWeeks = showMoreWeeks ? 12 : 4;
  for (let i = 0; i < maxWeeks; i++) {
    const weekStart = getWeekStart(i);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const label = i === 0 ? 'Diese Woche' : 
                 i === 1 ? 'Nächste Woche' :
                 `${weekStart.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}`;
    options.push({ value: i.toString(), label });
  }
  return options;
};
```

### 2. Modern CalendarView Component

#### Component Structure
```typescript
interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  bookedDates?: Date[];
}

interface CalendarDay {
  date: Date;
  status: 'past' | 'today' | 'available' | 'booked' | 'unavailable';
  isCurrentMonth: boolean;
  isSelected: boolean;
}
```

#### Design Features
- **Glassmorphism Aesthetic**: 
  - `backdrop-filter: blur(20px)`
  - Semi-transparent backgrounds with subtle gradients
  - Layered visual hierarchy with proper z-indexing
- **Date Status System**:
  - Past dates: Grayed out with strikethrough effect
  - Today: Special highlight with accent border and indicator dot
  - Available: Green accent styling with availability indicator
  - Booked: Red accent styling with booked indicator
  - Unavailable: Neutral gray styling
- **Interactive Elements**:
  - Smooth hover animations with `transform: translateY(-2px)`
  - Selection feedback with scale and shadow effects
  - Month navigation with smooth transitions
- **Mobile Optimization**:
  - Touch-friendly 48px minimum touch targets
  - Responsive grid that adapts to screen size
  - Optimized typography scaling

#### Visual Design Specifications
```scss
// Premium beauty brand color palette
$pink-primary: #FF6B9D;
$pink-secondary: #C44569;
$green-available: #10b981;
$red-booked: #ef4444;
$neutral-unavailable: #9ca3af;

// Glassmorphism effects
.calendar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 157, 0.08);
  border-radius: 20px;
  
  &::before {
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.02) 0%, 
      rgba(196, 69, 105, 0.01) 100%);
  }
}
```

### 3. AppointmentList Enhancement

#### Migration Strategy
- **Component Updates**: Replace all `Badge` imports with `Tag` imports
- **Props Mapping**: Ensure all Badge props are compatible with Tag component
- **Styling Consistency**: Maintain visual hierarchy while using Tag variants
- **Status Indicators**: Use appropriate Tag variants for different appointment statuses

#### Implementation
```typescript
// Before (Badge)
<Badge variant="neutral" size="s">
  {count}
</Badge>

// After (Tag)
<Tag variant="neutral" size="s">
  {count}
</Tag>
```

### 4. CustomerDetail Error Handling

#### Backend Endpoint Enhancement
```java
@GetMapping("/customers/{id}")
public ResponseEntity<ApiResponse<CustomerProfileResponse>> getCustomerById(@PathVariable Long id) {
    try {
        CustomerProfileResponse customer = adminService.getCustomerProfile(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    } catch (CustomerNotFoundException e) {
        logger.error("Customer not found with id: " + id, e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Kunde nicht gefunden"));
    } catch (Exception e) {
        logger.error("Failed to fetch customer with id: " + id, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Fehler beim Laden der Kundendaten"));
    }
}
```

#### Frontend Error Handling
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Kunde nicht gefunden');
        } else if (response.status === 401) {
          // Redirect to login
          router.push('/admin/login');
          return;
        } else {
          setError('Fehler beim Laden der Kundendaten');
        }
        return;
      }
      
      const data = await response.json();
      setCustomer(data.data);
    } catch (err) {
      setError('Netzwerkfehler beim Laden der Kundendaten');
    } finally {
      setLoading(false);
    }
  };
  
  fetchCustomer();
}, [id]);
```

## Data Models

### WeekSchedule Data Model
```typescript
interface WeekSchedule {
  id: string;                    // Unique identifier (e.g., "week-0", "week-1")
  weekStart: Date;              // Monday of the week
  weekEnd: Date;                // Sunday of the week
  slots: TimeSlot[];            // Array of time slots for the week
  saved: boolean;               // Whether the schedule has been saved
  createdAt?: Date;             // When the schedule was created
  updatedAt?: Date;             // When the schedule was last modified
}

interface TimeSlot {
  id: string;                   // Unique identifier
  day: string;                  // Day key (e.g., "monday", "tuesday")
  startTime: string;            // Start time in HH:MM format
  endTime: string;              // End time in HH:MM format
  isAvailable: boolean;         // Whether the slot is available
}
```

### CalendarDay Data Model
```typescript
interface CalendarDay {
  date: Date;                   // The actual date
  status: DateStatus;           // Current status of the date
  isCurrentMonth: boolean;      // Whether date belongs to current month
  isSelected: boolean;          // Whether date is currently selected
  appointmentCount?: number;    // Number of appointments on this date
}

type DateStatus = 'past' | 'today' | 'available' | 'booked' | 'unavailable';
```

## Error Handling

### API Error Responses
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Error handling patterns
const handleApiError = (response: Response) => {
  switch (response.status) {
    case 404:
      return 'Ressource nicht gefunden';
    case 401:
      return 'Nicht autorisiert';
    case 403:
      return 'Zugriff verweigert';
    case 500:
      return 'Serverfehler';
    default:
      return 'Ein unbekannter Fehler ist aufgetreten';
  }
};
```

### Frontend Error States
- **Loading States**: Skeleton components and spinners
- **Error States**: User-friendly error messages with retry options
- **Empty States**: Helpful guidance when no data is available
- **Network Errors**: Offline detection and retry mechanisms

## Testing Strategy

### Component Testing
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction with APIs
- **Visual Regression Tests**: Ensure design consistency
- **Accessibility Tests**: WCAG compliance verification

### User Experience Testing
- **Mobile Responsiveness**: Test across device sizes
- **Touch Interactions**: Ensure proper touch targets
- **Performance**: Loading times and smooth animations
- **Cross-browser Compatibility**: Modern browser support

### API Testing
- **Endpoint Validation**: Proper error responses
- **Authentication**: Token validation and refresh
- **Data Integrity**: Consistent data formats
- **Error Scenarios**: Network failures and timeouts

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large appointment lists
- **Image Optimization**: Proper sizing and formats

### Backend Optimization
- **Database Indexing**: Optimize customer and appointment queries
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Gzip compression for API responses

### Mobile Performance
- **Touch Responsiveness**: < 100ms touch feedback
- **Smooth Animations**: 60fps animations using CSS transforms
- **Reduced Motion**: Respect user preferences
- **Battery Optimization**: Efficient rendering and minimal reflows

## Security Considerations

### Authentication & Authorization
- **JWT Token Validation**: Proper token verification
- **Role-based Access**: Admin-only endpoints protection
- **Session Management**: Secure token storage and refresh
- **CSRF Protection**: Cross-site request forgery prevention

### Data Protection
- **Input Validation**: Sanitize all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **Data Encryption**: Sensitive data encryption at rest

### API Security
- **Rate Limiting**: Prevent API abuse
- **HTTPS Enforcement**: Secure data transmission
- **Error Information**: Avoid exposing sensitive details
- **Audit Logging**: Track administrative actions