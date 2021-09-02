import {MigrationInterface, QueryRunner} from "typeorm";

export class init1630625319331 implements MigrationInterface {
    name = 'init1630625319331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bio" text, "image" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_f44d0cd18cfd80b0fed7806c3b" UNIQUE ("profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "body" text NOT NULL, "authorId" uuid, "articleId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "authorId" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_followed_profiles" ("userId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_944c20024515356535988251b5e" PRIMARY KEY ("userId", "profileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e23fa37a8c1768cf96b4124b12" ON "users_followed_profiles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5eff9541e46480139a5defe83" ON "users_followed_profiles" ("profileId") `);
        await queryRunner.query(`CREATE TABLE "users_favorites_articles" ("userId" uuid NOT NULL, "articleId" uuid NOT NULL, CONSTRAINT "PK_bace578d921124643f982537360" PRIMARY KEY ("userId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8819360e377799a0e9327ea10c" ON "users_favorites_articles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_28a4d0a51cb042dd694f90bd9f" ON "users_favorites_articles" ("articleId") `);
        await queryRunner.query(`CREATE TABLE "article_tags_tag" ("articleId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_25290137c7f85b582eea2bc470d" PRIMARY KEY ("articleId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b7dd28292e2799512cd70bfd8" ON "article_tags_tag" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fee2a10f8d6688bd2f2c50f15" ON "article_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_followed_profiles" ADD CONSTRAINT "FK_e23fa37a8c1768cf96b4124b120" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_followed_profiles" ADD CONSTRAINT "FK_a5eff9541e46480139a5defe83d" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_8819360e377799a0e9327ea10c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_28a4d0a51cb042dd694f90bd9fb" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_9b7dd28292e2799512cd70bfd81" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e"`);
        await queryRunner.query(`ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_9b7dd28292e2799512cd70bfd81"`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_28a4d0a51cb042dd694f90bd9fb"`);
        await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_8819360e377799a0e9327ea10c0"`);
        await queryRunner.query(`ALTER TABLE "users_followed_profiles" DROP CONSTRAINT "FK_a5eff9541e46480139a5defe83d"`);
        await queryRunner.query(`ALTER TABLE "users_followed_profiles" DROP CONSTRAINT "FK_e23fa37a8c1768cf96b4124b120"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c20404221e5c125a581a0d90c0e"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7"`);
        await queryRunner.query(`DROP INDEX "IDX_5fee2a10f8d6688bd2f2c50f15"`);
        await queryRunner.query(`DROP INDEX "IDX_9b7dd28292e2799512cd70bfd8"`);
        await queryRunner.query(`DROP TABLE "article_tags_tag"`);
        await queryRunner.query(`DROP INDEX "IDX_28a4d0a51cb042dd694f90bd9f"`);
        await queryRunner.query(`DROP INDEX "IDX_8819360e377799a0e9327ea10c"`);
        await queryRunner.query(`DROP TABLE "users_favorites_articles"`);
        await queryRunner.query(`DROP INDEX "IDX_a5eff9541e46480139a5defe83"`);
        await queryRunner.query(`DROP INDEX "IDX_e23fa37a8c1768cf96b4124b12"`);
        await queryRunner.query(`DROP TABLE "users_followed_profiles"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
