import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarmersAssociation1783506092145 implements MigrationInterface {
  name = 'CreateFarmersAssociation1783506092145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_2a96fbb368a1162f96481339be\` ON \`farmers\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`farmers_association_notices\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`description\` text NOT NULL, \`image\` varchar(255) NULL, \`displayStartDate\` timestamp NULL, \`displayEndDate\` timestamp NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`associationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`farmers_associations\` (\`id\` varchar(36) NOT NULL, \`associationCode\` varchar(20) NOT NULL, \`name\` varchar(150) NOT NULL, \`district\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`village\` varchar(255) NOT NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c3e3be3759551a6397b0b05f35\` (\`updatedAt\`), UNIQUE INDEX \`IDX_84b6e6f9b2704c24995594ef68\` (\`associationCode\`), UNIQUE INDEX \`IDX_93564980eaf5a0c405d2a2343f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`farmers_association_members\` (\`id\` varchar(36) NOT NULL, \`joinedAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`farmerId\` varchar(36) NULL, \`associationId\` varchar(36) NULL, UNIQUE INDEX \`UQ_FARMER_ASSOCIATION_MEMBER\` (\`farmerId\`, \`associationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`phone_number\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`date_of_birth\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`profile_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`organization_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`phoneNumber\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD UNIQUE INDEX \`IDX_04889fbbf7dec355cc7f270583\` (\`phoneNumber\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`dateOfBirth\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`createdBy\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`updatedBy\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`farmers\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`farmers\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD UNIQUE INDEX \`IDX_2a96fbb368a1162f96481339be\` (\`nic\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_e65f209531c07fa50930397092\` ON \`farmers\` (\`district\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_5eba57e28d331c74d12a718f28\` ON \`farmers\` (\`province\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_07d54c2f215e64ae753e9147cd\` ON \`farmers\` (\`village\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_notices\` ADD CONSTRAINT \`FK_a7ccf01ca779073fbfadd15fbc0\` FOREIGN KEY (\`associationId\`) REFERENCES \`farmers_associations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_members\` ADD CONSTRAINT \`FK_9d87a6fa94b77cc94830b2f5de8\` FOREIGN KEY (\`farmerId\`) REFERENCES \`farmers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_members\` ADD CONSTRAINT \`FK_f927ad439f0d9ccb2f3649915e4\` FOREIGN KEY (\`associationId\`) REFERENCES \`farmers_associations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_members\` DROP FOREIGN KEY \`FK_f927ad439f0d9ccb2f3649915e4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_members\` DROP FOREIGN KEY \`FK_9d87a6fa94b77cc94830b2f5de8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers_association_notices\` DROP FOREIGN KEY \`FK_a7ccf01ca779073fbfadd15fbc0\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_07d54c2f215e64ae753e9147cd\` ON \`farmers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5eba57e28d331c74d12a718f28\` ON \`farmers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e65f209531c07fa50930397092\` ON \`farmers\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP INDEX \`IDX_2a96fbb368a1162f96481339be\``,
    );
    await queryRunner.query(`ALTER TABLE \`farmers\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`farmers\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`farmers\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`updatedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`createdAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`updatedBy\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`createdBy\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`dateOfBirth\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP INDEX \`IDX_04889fbbf7dec355cc7f270583\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` DROP COLUMN \`phoneNumber\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`organization_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`profile_image\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`date_of_birth\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farmers\` ADD \`phone_number\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`UQ_FARMER_ASSOCIATION_MEMBER\` ON \`farmers_association_members\``,
    );
    await queryRunner.query(`DROP TABLE \`farmers_association_members\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_93564980eaf5a0c405d2a2343f\` ON \`farmers_associations\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_84b6e6f9b2704c24995594ef68\` ON \`farmers_associations\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c3e3be3759551a6397b0b05f35\` ON \`farmers_associations\``,
    );
    await queryRunner.query(`DROP TABLE \`farmers_associations\``);
    await queryRunner.query(`DROP TABLE \`farmers_association_notices\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_2a96fbb368a1162f96481339be\` ON \`farmers\` (\`nic\`)`,
    );
  }
}
