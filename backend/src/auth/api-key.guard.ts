import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY;

    if (!expectedApiKey) {
      throw new UnauthorizedException('API_KEY not configured on server');
    }

    const apiKeyValue = Array.isArray(apiKey) ? apiKey[0] : apiKey;

    if (!apiKeyValue || apiKeyValue !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
