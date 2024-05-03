<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240430113531 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_library_user_library_items (user_library_id INT NOT NULL, user_library_items_id INT NOT NULL, INDEX IDX_F83D2D6C5942873B (user_library_id), INDEX IDX_F83D2D6C30061D4D (user_library_items_id), PRIMARY KEY(user_library_id, user_library_items_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_library_user_library_items ADD CONSTRAINT FK_F83D2D6C5942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_user_library_items ADD CONSTRAINT FK_F83D2D6C30061D4D FOREIGN KEY (user_library_items_id) REFERENCES user_library_items (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user DROP library_id');
        $this->addSql('ALTER TABLE user_library ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_library ADD CONSTRAINT FK_F98D86B6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F98D86B6A76ED395 ON user_library (user_id)');
        $this->addSql('ALTER TABLE user_library_items DROP FOREIGN KEY FK_3C3596325942873B');
        $this->addSql('ALTER TABLE user_library_items DROP FOREIGN KEY FK_3C35963276E71D49');
        $this->addSql('DROP INDEX IDX_3C3596325942873B ON user_library_items');
        $this->addSql('DROP INDEX IDX_3C35963276E71D49 ON user_library_items');
        $this->addSql('ALTER TABLE user_library_items DROP ebook_id, DROP user_library_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_library_user_library_items DROP FOREIGN KEY FK_F83D2D6C5942873B');
        $this->addSql('ALTER TABLE user_library_user_library_items DROP FOREIGN KEY FK_F83D2D6C30061D4D');
        $this->addSql('DROP TABLE user_library_user_library_items');
        $this->addSql('ALTER TABLE user ADD library_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_library DROP FOREIGN KEY FK_F98D86B6A76ED395');
        $this->addSql('DROP INDEX UNIQ_F98D86B6A76ED395 ON user_library');
        $this->addSql('ALTER TABLE user_library DROP user_id');
        $this->addSql('ALTER TABLE user_library_items ADD ebook_id INT DEFAULT NULL, ADD user_library_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_library_items ADD CONSTRAINT FK_3C3596325942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id)');
        $this->addSql('ALTER TABLE user_library_items ADD CONSTRAINT FK_3C35963276E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id)');
        $this->addSql('CREATE INDEX IDX_3C3596325942873B ON user_library_items (user_library_id)');
        $this->addSql('CREATE INDEX IDX_3C35963276E71D49 ON user_library_items (ebook_id)');
    }
}
