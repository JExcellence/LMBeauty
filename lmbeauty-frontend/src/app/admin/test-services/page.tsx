'use client';

import { useEffect, useState } from 'react';
import { Text } from '@once-ui-system/core';
import { useTreatments } from '@/hooks/useAdmin';

export default function TestServicesPage() {
  const { treatments, isLoading } = useTreatments();
  const [frontendServices, setFrontendServices] = useState<any[]>([]);
  const [frontendLoading, setFrontendLoading] = useState(true);

  useEffect(() => {
    const fetchFrontendServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/frontend/services/enhanced');
        const result = await response.json();
        if (result.success) {
          setFrontendServices(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching frontend services:', error);
      } finally {
        setFrontendLoading(false);
      }
    };

    fetchFrontendServices();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Text style={{ fontSize: '32px', marginBottom: '40px' }}>
        Services Test - Admin vs Frontend
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Admin View */}
        <div>
          <Text style={{ fontSize: '24px', marginBottom: '20px' }}>
            Admin View (Raw Treatments)
          </Text>
          {isLoading ? (
            <Text>Loading admin treatments...</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {treatments.map((treatment) => (
                <div 
                  key={treatment.id} 
                  style={{ 
                    padding: '16px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    background: '#f9f9f9'
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{treatment.name}</Text>
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    {treatment.category} - {treatment.price}€ - {treatment.durationMinutes}min
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#888' }}>
                    Active: {treatment.active ? 'Yes' : 'No'} | 
                    Refills: {treatment.hasRefillOptions ? 'Yes' : 'No'} |
                    Slug: {treatment.slug || 'None'}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frontend View */}
        <div>
          <Text style={{ fontSize: '24px', marginBottom: '20px' }}>
            Frontend View (Enhanced Services)
          </Text>
          {frontendLoading ? (
            <Text>Loading frontend services...</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {frontendServices.map((service) => (
                <div 
                  key={service.id} 
                  style={{ 
                    padding: '16px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    background: '#f0f8ff'
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{service.title}</Text>
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    {service.personaTag}
                  </Text>
                  <Text style={{ fontSize: '13px', color: '#777' }}>
                    {service.description}
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#888' }}>
                    Price: {service.price.prefix} {service.price.amount}{service.price.currency} | 
                    Duration: {service.duration}min
                  </Text>
                  {service.details?.refillPrices && service.details.refillPrices.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Refill Options:</Text>
                      {service.details.refillPrices.map((refill: any, i: number) => (
                        <Text key={i} style={{ fontSize: '11px', color: '#666' }}>
                          • {refill.weeks}: {refill.price}
                        </Text>
                      ))}
                    </div>
                  )}
                  <Text style={{ fontSize: '11px', color: '#999' }}>
                    Booking URL: {service.bookingUrl}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <Text style={{ fontSize: '18px', marginBottom: '16px' }}>Instructions:</Text>
        <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
          1. Go to <strong>/admin/treatments</strong> to create/edit services<br/>
          2. Create a new Wimpern service with refill options<br/>
          3. Check this page to see if it appears in both admin and frontend views<br/>
          4. The frontend services should appear in the main ServicesSection component<br/>
          5. Services with refill options will show refill pricing in the frontend
        </Text>
      </div>
    </div>
  );
}