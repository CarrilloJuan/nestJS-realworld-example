import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1630448266826 implements MigrationInterface {
  name = 'init1630448266826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bio" text, "image" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_f44d0cd18cfd80b0fed7806c3b" UNIQUE ("profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "body" text NOT NULL, "autorId" uuid, "articleSlug" character varying, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "favorites_count" integer NOT NULL DEFAULT '0', "authorId" uuid, CONSTRAINT "UQ_fca3cb9ba4963678f564f22e7a8" UNIQUE ("title"), CONSTRAINT "PK_0ab85f4be07b22d79906671d72f" PRIMARY KEY ("slug"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_followed_profiles" ("userId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_944c20024515356535988251b5e" PRIMARY KEY ("userId", "profileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e23fa37a8c1768cf96b4124b12" ON "users_followed_profiles" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5eff9541e46480139a5defe83" ON "users_followed_profiles" ("profileId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_favorites_articles" ("userId" uuid NOT NULL, "articleSlug" character varying NOT NULL, CONSTRAINT "PK_387d103010a1fed0706f8703c70" PRIMARY KEY ("userId", "articleSlug"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8819360e377799a0e9327ea10c" ON "users_favorites_articles" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a4e2601668b265e2f2bec4c960" ON "users_favorites_articles" ("articleSlug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "article_tags_tag" ("articleSlug" character varying NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_bec5bab8bcfbcd07a3f70a14ce0" PRIMARY KEY ("articleSlug", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38fa46f47347aab10aa694b67b" ON "article_tags_tag" ("articleSlug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fee2a10f8d6688bd2f2c50f15" ON "article_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_0053c026ca0ec54ebfe54a2adff" FOREIGN KEY ("autorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_938695300f0c6c558a27fc0aea4" FOREIGN KEY ("articleSlug") REFERENCES "article"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_followed_profiles" ADD CONSTRAINT "FK_e23fa37a8c1768cf96b4124b120" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_followed_profiles" ADD CONSTRAINT "FK_a5eff9541e46480139a5defe83d" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_8819360e377799a0e9327ea10c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_a4e2601668b265e2f2bec4c9605" FOREIGN KEY ("articleSlug") REFERENCES "article"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_38fa46f47347aab10aa694b67b2" FOREIGN KEY ("articleSlug") REFERENCES "article"("slug") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_38fa46f47347aab10aa694b67b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_a4e2601668b265e2f2bec4c9605"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_8819360e377799a0e9327ea10c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_followed_profiles" DROP CONSTRAINT "FK_a5eff9541e46480139a5defe83d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_followed_profiles" DROP CONSTRAINT "FK_e23fa37a8c1768cf96b4124b120"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_938695300f0c6c558a27fc0aea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_0053c026ca0ec54ebfe54a2adff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_5fee2a10f8d6688bd2f2c50f15"`);
    await queryRunner.query(`DROP INDEX "IDX_38fa46f47347aab10aa694b67b"`);
    await queryRunner.query(`DROP TABLE "article_tags_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_a4e2601668b265e2f2bec4c960"`);
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
