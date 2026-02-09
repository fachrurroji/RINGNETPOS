import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor(private configService: ConfigService) {
        this.client = new Redis(
            this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
        );
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.setex(key, ttlSeconds, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async delPattern(pattern: string): Promise<void> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }

    // Product caching helpers
    private getProductCacheKey(tenantId: string, sku: string): string {
        return `tenant:${tenantId}:product:${sku}`;
    }

    async cacheProduct(tenantId: string, sku: string, product: any): Promise<void> {
        const key = this.getProductCacheKey(tenantId, sku);
        await this.set(key, JSON.stringify(product), 3600); // 1 hour TTL
    }

    async getCachedProduct(tenantId: string, sku: string): Promise<any | null> {
        const key = this.getProductCacheKey(tenantId, sku);
        const cached = await this.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    async invalidateProduct(tenantId: string, sku: string): Promise<void> {
        const key = this.getProductCacheKey(tenantId, sku);
        await this.del(key);
    }

    async invalidateAllProducts(tenantId: string): Promise<void> {
        await this.delPattern(`tenant:${tenantId}:product:*`);
    }
}
