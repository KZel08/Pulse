import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('conversation_members')
export class ConversationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  userId: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member';

  @CreateDateColumn()
  joinedAt: Date;
}
