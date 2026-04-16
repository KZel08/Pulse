/**
 * Chat Communication Test - E2E Test Case
 *
 * This test demonstrates that two users can communicate via WebSocket
 * on the same port from different browser windows.
 *
 * To run this test:
 * 1. Set up PostgreSQL and Redis (see docs/CHAT_TEST_RUN_GUIDE.md)
 * 2. Configure backend/.env with database credentials
 * 3. Run: npm run test:e2e -- --testNamePattern="should allow 2 users to communicate via WebSocket"
 *
 * Note: This test requires a running database. For development/testing without
 * database setup, consider using mocked services or an in-memory database.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { ChatService } from '../src/chat/chat.service';

describe('Chat Communication Test (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let chatService: ChatService;

  beforeAll(async () => {
    // This test requires the full application to be running
    // For production testing, ensure database and Redis are available
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0); // Use random available port for testing

    authService = app.get(AuthService);
    chatService = app.get(ChatService);
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should allow 2 users to communicate via WebSocket on same port', (done) => {
    // This test simulates the scenario where:
    // 1. Two users connect to the same WebSocket server on the same port
    // 2. They authenticate using JWT tokens
    // 3. One user sends a message
    // 4. The other user receives the message in real-time

    const serverUrl = `http://localhost:${app.getHttpServer().address().port}`;

    // Simulate User 1 connecting (first browser window)
    const socket1: Socket = io(serverUrl, {
      auth: { token: 'mock-jwt-token-user1' },
      forceNew: true,
    });

    // Simulate User 2 connecting (second browser window)
    const socket2: Socket = io(serverUrl, {
      auth: { token: 'mock-jwt-token-user2' },
      forceNew: true,
    });

    let messageReceived = false;
    const testMessage = 'Hello from User 1!';

    // User 2 listens for messages
    socket2.on('new_message', (message) => {
      // Verify the message was received
      expect(message.content).toBe(testMessage);
      expect(message.conversationId).toBeDefined();
      messageReceived = true;

      // Clean up connections
      socket1.disconnect();
      socket2.disconnect();
      done();
    });

    // User 1 connects and sends a message
    socket1.on('connect', () => {
      const conversationId = 'test-conversation-123';

      // Join conversation room
      socket1.emit('join_conversation', { conversationId });

      // Send message
      socket1.emit('send_message', {
        conversationId,
        content: testMessage,
      });
    });

    // User 2 connects and joins the same conversation
    socket2.on('connect', () => {
      const conversationId = 'test-conversation-123';
      socket2.emit('join_conversation', { conversationId });
    });

    // Timeout if test takes too long
    setTimeout(() => {
      if (!messageReceived) {
        socket1.disconnect();
        socket2.disconnect();
        done(new Error('Test timed out - message not received'));
      }
    }, 10000);
  });

  /**
   * Additional test cases that could be added:
   *
   * it('should handle multiple users in group conversation', () => { ... })
   * it('should support typing indicators', () => { ... })
   * it('should handle message reactions', () => { ... })
   * it('should manage user presence (online/offline)', () => { ... })
   * it('should support file sharing', () => { ... })
   */
});
