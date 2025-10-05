# Performance Troubleshooting Guide for POS Application

## Table of Contents
1. [Performance Benchmarks](#performance-benchmarks)
2. [Identifying Performance Bottlenecks](#identifying-performance-bottlenecks)
3. [Client-Side Performance Analysis](#client-side-performance-analysis)
4. [Network Latency Analysis](#network-latency-analysis)
5. [Data Storage Optimization](#data-storage-optimization)
6. [Caching Strategies](#caching-strategies)
7. [Monitoring Tools](#monitoring-tools)
8. [Step-by-Step Troubleshooting Process](#step-by-step-troubleshooting-process)

## Performance Benchmarks

### Acceptable Response Times
- **Page Load Time**: < 2 seconds (initial load)
- **Navigation Between Pages**: < 500ms
- **Cart Operations**: < 200ms
- **Search/Filter Operations**: < 300ms
- **Form Submissions**: < 1 second
- **Data Synchronization**: < 500ms

### Critical Thresholds
- **Warning**: > 3 seconds for any operation
- **Critical**: > 5 seconds for any operation
- **Memory Usage**: < 100MB for localStorage data
- **Bundle Size**: < 1MB for initial JavaScript load

## Identifying Performance Bottlenecks

### 1. Browser Developer Tools Analysis

#### Performance Tab
```bash
# Steps to analyze performance:
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform slow operations in your app
5. Stop recording
6. Analyze the flame graph for:
   - Long-running JavaScript tasks
   - Layout thrashing
   - Excessive re-renders
```

#### Network Tab
```bash
# Check for:
- Large bundle sizes
- Slow-loading resources
- Failed requests
- Waterfall loading issues
```

#### Memory Tab
```bash
# Monitor:
- Memory leaks
- Excessive object creation
- localStorage size growth
```

### 2. React Developer Tools Profiler

```bash
# Installation:
npm install --save-dev @welldone-software/why-did-you-render

# Add to your app (development only):
# components/why-did-you-render.js
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

## Client-Side Performance Analysis

### 1. Component Re-render Analysis

Create a performance monitoring hook:

```typescript
// hooks/use-performance-monitor.ts
import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times, took ${renderTime}ms`);
    }

    startTime.current = Date.now();
  });

  return renderCount.current;
}
```

### 2. localStorage Performance Monitoring

```typescript
// lib/storage-performance.ts
export class StoragePerformanceMonitor {
  static measureOperation<T>(operation: () => T, operationName: string): T {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    console.log(`${operationName} took ${end - start} milliseconds`);
    
    if (end - start > 100) {
      console.warn(`Slow storage operation detected: ${operationName}`);
    }
    
    return result;
  }

  static getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static checkStorageHealth(): void {
    const size = this.getStorageSize();
    const sizeMB = size / (1024 * 1024);
    
    console.log(`localStorage size: ${sizeMB.toFixed(2)} MB`);
    
    if (sizeMB > 5) {
      console.warn('localStorage is getting large, consider data cleanup');
    }
  }
}
```

## Network Latency Analysis

### 1. Network Performance Testing

```typescript
// lib/network-monitor.ts
export class NetworkMonitor {
  static async measureLatency(url: string = window.location.origin): Promise<number> {
    const start = performance.now();
    
    try {
      await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      const end = performance.now();
      return end - start;
    } catch (error) {
      console.error('Network latency test failed:', error);
      return -1;
    }
  }

  static async runNetworkDiagnostics(): Promise<void> {
    const latency = await this.measureLatency();
    
    console.log(`Network latency: ${latency.toFixed(2)}ms`);
    
    if (latency > 1000) {
      console.warn('High network latency detected');
    }

    // Test connection quality
    const connection = (navigator as any).connection;
    if (connection) {
      console.log(`Connection type: ${connection.effectiveType}`);
      console.log(`Downlink: ${connection.downlink} Mbps`);
    }
  }
}
```

### 2. Resource Loading Optimization

```typescript
// lib/resource-optimizer.ts
export class ResourceOptimizer {
  static preloadCriticalResources(): void {
    const criticalResources = [
      '/api/products',
      '/api/customers',
      // Add other critical endpoints
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  static lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}
```

## Data Storage Optimization

### 1. Optimize localStorage Operations

```typescript
// lib/optimized-storage.ts
export class OptimizedStorage {
  private static cache = new Map<string, any>();
  private static compressionEnabled = true;

  static setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      
      // Cache in memory for faster access
      this.cache.set(key, value);
      
      // Compress large data if needed
      const finalValue = this.compressionEnabled && serialized.length > 1000
        ? this.compress(serialized)
        : serialized;
      
      localStorage.setItem(key, finalValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      this.cleanup();
    }
  }

  static getItem<T>(key: string): T | null {
    // Check memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to parse localStorage item:', error);
      return null;
    }
  }

  private static compress(data: string): string {
    // Simple compression - in production, use a proper compression library
    return btoa(data);
  }

  private static cleanup(): void {
    // Remove old or large items
    const items = Object.keys(localStorage);
    items.forEach(key => {
      const item = localStorage.getItem(key);
      if (item && item.length > 100000) { // 100KB threshold
        localStorage.removeItem(key);
        console.log(`Removed large item: ${key}`);
      }
    });
  }
}
```

### 2. Data Pagination and Virtualization

```typescript
// hooks/use-virtual-list.ts
import { useMemo, useState } from 'react';

interface UseVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
}

export function useVirtualList<T>({ items, itemHeight, containerHeight }: UseVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return {
    ...visibleItems,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}
```

## Caching Strategies

### 1. Memory Caching for Frequently Accessed Data

```typescript
// lib/memory-cache.ts
export class MemoryCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
```

### 2. Service Worker for Asset Caching

```typescript
// public/sw.js
const CACHE_NAME = 'pos-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  // Add other static assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## Monitoring Tools

### 1. Performance Monitoring Component

```typescript
// components/performance-monitor.tsx
import { useEffect, useState } from 'react';
import { NetworkMonitor } from '@/lib/network-monitor';
import { StoragePerformanceMonitor } from '@/lib/storage-performance';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    latency: 0,
    storageSize: 0,
    renderTime: 0,
  });

  useEffect(() => {
    const updateMetrics = async () => {
      const latency = await NetworkMonitor.measureLatency();
      const storageSize = StoragePerformanceMonitor.getStorageSize();
      
      setMetrics({
        latency,
        storageSize: storageSize / (1024 * 1024), // Convert to MB
        renderTime: performance.now(),
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
      <div>Latency: {metrics.latency.toFixed(0)}ms</div>
      <div>Storage: {metrics.storageSize.toFixed(2)}MB</div>
      <div>Render: {metrics.renderTime.toFixed(0)}ms</div>
    </div>
  );
}
```

### 2. Web Vitals Monitoring

```bash
npm install web-vitals
```

```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// Add to your _app.tsx
// initWebVitals();
```

## Step-by-Step Troubleshooting Process

### Phase 1: Initial Assessment (5 minutes)
1. **Check Browser Console**: Look for JavaScript errors
2. **Network Tab**: Identify slow-loading resources
3. **Performance Tab**: Record a 30-second session
4. **Memory Usage**: Check if memory is growing over time

### Phase 2: Component Analysis (10 minutes)
1. **Add Performance Monitoring**: Use the hooks provided above
2. **Identify Heavy Components**: Look for components that re-render frequently
3. **Check State Management**: Ensure contexts aren't causing unnecessary re-renders
4. **Analyze Bundle Size**: Use webpack-bundle-analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
# Add to package.json scripts:
"analyze": "ANALYZE=true npm run build"
```

### Phase 3: Data Optimization (15 minutes)
1. **localStorage Analysis**: Check size and access patterns
2. **Implement Virtualization**: For large lists (products, orders)
3. **Add Pagination**: Limit data loaded at once
4. **Optimize Filters**: Use debouncing for search inputs

### Phase 4: Caching Implementation (20 minutes)
1. **Memory Cache**: Implement for frequently accessed data
2. **Service Worker**: Cache static assets
3. **Component Memoization**: Use React.memo and useMemo
4. **Image Optimization**: Implement lazy loading

### Phase 5: Monitoring Setup (10 minutes)
1. **Add Performance Monitor**: Include in development builds
2. **Set Up Alerts**: Log warnings for slow operations
3. **Regular Cleanup**: Implement automatic cache cleanup
4. **User Feedback**: Add loading states and progress indicators

## Quick Fixes Checklist

### Immediate Actions (< 5 minutes)
- [ ] Add loading states to all async operations
- [ ] Implement debouncing for search inputs
- [ ] Use React.memo for pure components
- [ ] Add error boundaries to prevent crashes

### Short-term Improvements (< 30 minutes)
- [ ] Implement virtual scrolling for large lists
- [ ] Add memory caching for products and customers
- [ ] Optimize localStorage operations
- [ ] Add performance monitoring

### Long-term Optimizations (< 2 hours)
- [ ] Implement service worker caching
- [ ] Add bundle splitting and lazy loading
- [ ] Optimize component re-renders
- [ ] Set up comprehensive monitoring

## Performance Testing Script

```typescript
// scripts/performance-test.ts
export async function runPerformanceTest() {
  console.log('Starting performance test...');
  
  // Test localStorage operations
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    localStorage.setItem(`test-${i}`, JSON.stringify({ data: 'test' }));
  }
  const storageTime = performance.now() - start;
  
  // Cleanup
  for (let i = 0; i < 1000; i++) {
    localStorage.removeItem(`test-${i}`);
  }
  
  console.log(`localStorage operations: ${storageTime.toFixed(2)}ms`);
  
  // Test network latency
  const latency = await NetworkMonitor.measureLatency();
  console.log(`Network latency: ${latency.toFixed(2)}ms`);
  
  // Test memory usage
  const memoryInfo = (performance as any).memory;
  if (memoryInfo) {
    console.log(`Memory usage: ${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
  }
}
```

Run this test periodically to ensure your optimizations are working effectively.