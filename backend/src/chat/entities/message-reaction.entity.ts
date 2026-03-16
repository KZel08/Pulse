import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique
} from "typeorm";

@Entity("message_reactions")
@Unique(["messageId", "userId", "emoji"])
export class MessageReaction {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  messageId: string;

  @Column()
  userId: string;

  @Column()
  emoji: string;

  @CreateDateColumn()
  createdAt: Date;
}