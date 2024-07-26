import request from 'supertest';
import app from '../../src/index';
import { createClient } from '@supabase/supabase-js'

const apiKey = process.env.apiKey;

const supabase = createClient(process.env.supabaseUrl!, process.env.supabaseKey!);

describe('API Endpoints', () => {
    it('GET /boardgames should return 50 boardgames', async () => {
        const response = await request(app)
            .get('/boardgames')
            .set('x-api-key', `${apiKey}`)
            .expect(200);

        // console.log(response.body)

        expect(response.body).toBeDefined();
    })
})