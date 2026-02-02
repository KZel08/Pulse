import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: 'direct' | 'group';

  // For direct chats only
  @Column({ nullable: true })
  userAId?: string;

  @Column({ nullable: true })
  userBId?: string;

  // For group chats
  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt: Date;
}