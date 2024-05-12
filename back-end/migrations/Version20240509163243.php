<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240509163243 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE favorite_books (id INT AUTO_INCREMENT NOT NULL, user_library_id INT DEFAULT NULL, is_favorite TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_FC9301B65942873B (user_library_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE favorite_books_user (favorite_books_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B0D1949BD78FB4D1 (favorite_books_id), INDEX IDX_B0D1949BA76ED395 (user_id), PRIMARY KEY(favorite_books_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE favorite_books_ebook (favorite_books_id INT NOT NULL, ebook_id INT NOT NULL, INDEX IDX_15B182B7D78FB4D1 (favorite_books_id), INDEX IDX_15B182B776E71D49 (ebook_id), PRIMARY KEY(favorite_books_id, ebook_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE favorite_books ADD CONSTRAINT FK_FC9301B65942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id)');
        $this->addSql('ALTER TABLE favorite_books_user ADD CONSTRAINT FK_B0D1949BD78FB4D1 FOREIGN KEY (favorite_books_id) REFERENCES favorite_books (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_user ADD CONSTRAINT FK_B0D1949BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_ebook ADD CONSTRAINT FK_15B182B7D78FB4D1 FOREIGN KEY (favorite_books_id) REFERENCES favorite_books (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_ebook ADD CONSTRAINT FK_15B182B776E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorite_books DROP FOREIGN KEY FK_FC9301B65942873B');
        $this->addSql('ALTER TABLE favorite_books_user DROP FOREIGN KEY FK_B0D1949BD78FB4D1');
        $this->addSql('ALTER TABLE favorite_books_user DROP FOREIGN KEY FK_B0D1949BA76ED395');
        $this->addSql('ALTER TABLE favorite_books_ebook DROP FOREIGN KEY FK_15B182B7D78FB4D1');
        $this->addSql('ALTER TABLE favorite_books_ebook DROP FOREIGN KEY FK_15B182B776E71D49');
        $this->addSql('DROP TABLE favorite_books');
        $this->addSql('DROP TABLE favorite_books_user');
        $this->addSql('DROP TABLE favorite_books_ebook');
    }
}
