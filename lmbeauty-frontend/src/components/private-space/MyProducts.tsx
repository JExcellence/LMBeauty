'use client';

import { Column, Row, Text, Icon } from '@once-ui-system/core';
import type { ProductPurchase } from '@/types';
import styles from './MyProducts.module.scss';

interface MyProductsProps {
  products: ProductPurchase[];
}

export function MyProducts({ products }: MyProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Column className={styles.myProducts} gap="20">
      <Row gap="12" vertical="center">
        <Column center className={styles.sectionIcon}>
          <Icon name="shoppingBag" size="m" />
        </Column>
        <Text variant="heading-strong-m" style={{ color: '#2D2A26' }}>
          Deine Produkte
        </Text>
      </Row>
      
      <Row className={styles.productsGrid} gap="12">
        {products.map((product) => (
          <Column key={product.id} className={styles.productItem} gap="12" center>
            {product.productImageUrl ? (
              <div className={styles.productImageWrapper}>
                <img 
                  src={product.productImageUrl} 
                  alt={product.productName}
                  className={styles.productImage}
                />
              </div>
            ) : (
              <Column center className={styles.productPlaceholder}>
                <Icon name="sparkle" size="m" />
              </Column>
            )}
            <Text variant="body-default-s" style={{ color: '#2D2A26', textAlign: 'center' }}>
              {product.productName}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}
