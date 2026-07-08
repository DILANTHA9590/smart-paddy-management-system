import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFarmersAssociation1783506843172 implements MigrationInterface {
    name = 'CreateFarmersAssociation1783506843172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`roleName\` enum ('SUPER_ADMIN', 'ADMIN', 'FARMER', 'AGRICULTURE_ADVISOR', 'IRRIGATION_OFFICER', 'SUPERVISOR', 'ORGANIZATION_MANAGER') NOT NULL, \`description\` varchar(255) NULL, \`updatedBy\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_992f24b9d80eb1312440ca577f\` (\`roleName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`farmers_association_notices\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`description\` text NOT NULL, \`image\` varchar(255) NULL, \`displayStartDate\` timestamp NULL, \`displayEndDate\` timestamp NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`associationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`farmers_associations\` (\`id\` varchar(36) NOT NULL, \`associationCode\` varchar(20) NOT NULL, \`name\` varchar(150) NOT NULL, \`district\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`village\` varchar(255) NOT NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c3e3be3759551a6397b0b05f35\` (\`updatedAt\`), UNIQUE INDEX \`IDX_84b6e6f9b2704c24995594ef68\` (\`associationCode\`), UNIQUE INDEX \`IDX_93564980eaf5a0c405d2a2343f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`farmers_association_members\` (\`id\` varchar(36) NOT NULL, \`joinedAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`farmerId\` varchar(36) NULL, \`associationId\` varchar(36) NULL, UNIQUE INDEX \`UQ_FARMER_ASSOCIATION_MEMBER\` (\`farmerId\`, \`associationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`farmers\` (\`id\` varchar(36) NOT NULL, \`nic\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`address\` text NOT NULL, \`district\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`village\` varchar(255) NOT NULL, \`dateOfBirth\` date NOT NULL, \`gender\` enum ('Male', 'Female', 'Other') NOT NULL, \`createdBy\` varchar(255) NULL, \`updatedBy\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, INDEX \`IDX_2a96fbb368a1162f96481339be\` (\`nic\`), INDEX \`IDX_04889fbbf7dec355cc7f270583\` (\`phoneNumber\`), INDEX \`IDX_e65f209531c07fa50930397092\` (\`district\`), INDEX \`IDX_5eba57e28d331c74d12a718f28\` (\`province\`), INDEX \`IDX_07d54c2f215e64ae753e9147cd\` (\`village\`), UNIQUE INDEX \`IDX_2a96fbb368a1162f96481339be\` (\`nic\`), UNIQUE INDEX \`IDX_04889fbbf7dec355cc7f270583\` (\`phoneNumber\`), UNIQUE INDEX \`REL_f2598912e9b3fd889f6fecee93\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL, \`userName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`password\` varchar(255) NOT NULL, \`userStatus\` enum ('pending', 'active', 'blocked') NOT NULL DEFAULT 'pending', \`tokenVersion\` int NOT NULL DEFAULT '0', \`salt\` varchar(255) NULL, \`assignedRoleBy\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_226bb9aa7aa8a69991209d58f5\` (\`userName\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`farmers_association_notices\` ADD CONSTRAINT \`FK_a7ccf01ca779073fbfadd15fbc0\` FOREIGN KEY (\`associationId\`) REFERENCES \`farmers_associations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`farmers_association_members\` ADD CONSTRAINT \`FK_9d87a6fa94b77cc94830b2f5de8\` FOREIGN KEY (\`farmerId\`) REFERENCES \`farmers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`farmers_association_members\` ADD CONSTRAINT \`FK_f927ad439f0d9ccb2f3649915e4\` FOREIGN KEY (\`associationId\`) REFERENCES \`farmers_associations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`farmers\` ADD CONSTRAINT \`FK_f2598912e9b3fd889f6fecee93f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`ALTER TABLE \`farmers\` DROP FOREIGN KEY \`FK_f2598912e9b3fd889f6fecee93f\``);
        await queryRunner.query(`ALTER TABLE \`farmers_association_members\` DROP FOREIGN KEY \`FK_f927ad439f0d9ccb2f3649915e4\``);
        await queryRunner.query(`ALTER TABLE \`farmers_association_members\` DROP FOREIGN KEY \`FK_9d87a6fa94b77cc94830b2f5de8\``);
        await queryRunner.query(`ALTER TABLE \`farmers_association_notices\` DROP FOREIGN KEY \`FK_a7ccf01ca779073fbfadd15fbc0\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_226bb9aa7aa8a69991209d58f5\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_f2598912e9b3fd889f6fecee93\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_04889fbbf7dec355cc7f270583\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_2a96fbb368a1162f96481339be\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_07d54c2f215e64ae753e9147cd\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_5eba57e28d331c74d12a718f28\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_e65f209531c07fa50930397092\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_04889fbbf7dec355cc7f270583\` ON \`farmers\``);
        await queryRunner.query(`DROP INDEX \`IDX_2a96fbb368a1162f96481339be\` ON \`farmers\``);
        await queryRunner.query(`DROP TABLE \`farmers\``);
        await queryRunner.query(`DROP INDEX \`UQ_FARMER_ASSOCIATION_MEMBER\` ON \`farmers_association_members\``);
        await queryRunner.query(`DROP TABLE \`farmers_association_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_93564980eaf5a0c405d2a2343f\` ON \`farmers_associations\``);
        await queryRunner.query(`DROP INDEX \`IDX_84b6e6f9b2704c24995594ef68\` ON \`farmers_associations\``);
        await queryRunner.query(`DROP INDEX \`IDX_c3e3be3759551a6397b0b05f35\` ON \`farmers_associations\``);
        await queryRunner.query(`DROP TABLE \`farmers_associations\``);
        await queryRunner.query(`DROP TABLE \`farmers_association_notices\``);
        await queryRunner.query(`DROP INDEX \`IDX_992f24b9d80eb1312440ca577f\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
