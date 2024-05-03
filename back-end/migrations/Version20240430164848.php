<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240430164848 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_library_ebook (user_library_id INT NOT NULL, ebook_id INT NOT NULL, INDEX IDX_A07A0C725942873B (user_library_id), INDEX IDX_A07A0C7276E71D49 (ebook_id), PRIMARY KEY(user_library_id, ebook_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_library_ebook ADD CONSTRAINT FK_A07A0C725942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_ebook ADD CONSTRAINT FK_A07A0C7276E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_user_library_items DROP FOREIGN KEY FK_F83D2D6C5942873B');
        $this->addSql('ALTER TABLE user_library_user_library_items DROP FOREIGN KEY FK_F83D2D6C30061D4D');
        $this->addSql('DROP TABLE user_library_items');
        $this->addSql('DROP TABLE user_library_user_library_items');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_library_items (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_library_user_library_items (user_library_id INT NOT NULL, user_library_items_id INT NOT NULL, INDEX IDX_F83D2D6C30061D4D (user_library_items_id), INDEX IDX_F83D2D6C5942873B (user_library_id), PRIMARY KEY(user_library_id, user_library_items_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_library_user_library_items ADD CONSTRAINT FK_F83D2D6C5942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_user_library_items ADD CONSTRAINT FK_F83D2D6C30061D4D FOREIGN KEY (user_library_items_id) REFERENCES user_library_items (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_ebook DROP FOREIGN KEY FK_A07A0C725942873B');
        $this->addSql('ALTER TABLE user_library_ebook DROP FOREIGN KEY FK_A07A0C7276E71D49');
        $this->addSql('DROP TABLE user_library_ebook');
    }
}
