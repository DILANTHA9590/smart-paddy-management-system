import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleUserFarmerRelations1781282344883 implements MigrationInterface {
  name = 'AddRoleUserFarmerRelations1781282344883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`farmers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nic\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`address\` text NOT NULL, \`district\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`village\` varchar(255) NOT NULL, \`date_of_birth\` date NOT NULL, \`gender\` enum ('Male', 'Female', 'Other') NOT NULL, \`profile_image\` varchar(255) NULL, \`organization_id\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_2a96fbb368a1162f96481339be\` (\`nic\`), UNIQUE INDEX \`REL_f2598912e9b3fd889f6fecee93\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`description\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`updatedBy\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_992f24b9d80eb1312440ca577f\` ON \`roles\``,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`roleName\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`roleName\` enum ('SUPER_ADMIN', 'ADMIN', 'FARMER', 'AGRICULTURE_ADVISOR', 'IRRIGATION_OFFICER', 'SUPERVISOR', 'ORGANIZATION_MANAGER') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_992f24b9d80eb1312440ca577f\` (\`roleName\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role_id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD CONSTRAINT \`FK_f2598912e9b3fd889f6fecee93f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP FOREIGN KEY \`FK_f2598912e9b3fd889f6fecee93f\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`role_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP INDEX \`IDX_992f24b9d80eb1312440ca577f\``,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`roleName\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`roleName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_992f24b9d80eb1312440ca577f\` ON \`roles\` (\`roleName\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`roles\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`updatedBy\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f2598912e9b3fd889f6fecee93\` ON \`farmers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2a96fbb368a1162f96481339be\` ON \`farmers\``,
    );
    await queryRunner.query(`DROP TABLE \`farmers\``);
  }
}
