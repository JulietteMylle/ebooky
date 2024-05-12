<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240512161127 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comments (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, ebook_id_id INT NOT NULL, content LONGTEXT NOT NULL, date DATE NOT NULL, rate INT NOT NULL, INDEX IDX_5F9E962A9D86650F (user_id_id), INDEX IDX_5F9E962AD80868CE (ebook_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AD80868CE FOREIGN KEY (ebook_id_id) REFERENCES ebook (id)');
        $this->addSql('ALTER TABLE blog_post DROP FOREIGN KEY FK_BA5AE01D9D86650F');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C9D86650F');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CE993051');
        $this->addSql('ALTER TABLE favorite_books DROP FOREIGN KEY FK_FC9301B65942873B');
        $this->addSql('ALTER TABLE favorite_books_ebook DROP FOREIGN KEY FK_15B182B776E71D49');
        $this->addSql('ALTER TABLE favorite_books_ebook DROP FOREIGN KEY FK_15B182B7D78FB4D1');
        $this->addSql('ALTER TABLE favorite_books_user DROP FOREIGN KEY FK_B0D1949BA76ED395');
        $this->addSql('ALTER TABLE favorite_books_user DROP FOREIGN KEY FK_B0D1949BD78FB4D1');
        $this->addSql('ALTER TABLE user_library DROP FOREIGN KEY FK_F98D86B6A76ED395');
        $this->addSql('ALTER TABLE user_library_ebook DROP FOREIGN KEY FK_A07A0C725942873B');
        $this->addSql('ALTER TABLE user_library_ebook DROP FOREIGN KEY FK_A07A0C7276E71D49');
        $this->addSql('DROP TABLE blog_post');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE favorite_books');
        $this->addSql('DROP TABLE favorite_books_ebook');
        $this->addSql('DROP TABLE favorite_books_user');
        $this->addSql('DROP TABLE user_library');
        $this->addSql('DROP TABLE user_library_ebook');
        $this->addSql('ALTER TABLE ebook ADD average_rating DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD token_reset VARCHAR(255) DEFAULT NULL, ADD token_expires DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blog_post (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, title VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, subtitle VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, content LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_BA5AE01D9D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, blog_post_id_id INT NOT NULL, user_id_id INT NOT NULL, content VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_9474526C9D86650F (user_id_id), INDEX IDX_9474526CE993051 (blog_post_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE favorite_books (id INT AUTO_INCREMENT NOT NULL, user_library_id INT DEFAULT NULL, is_favorite TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_FC9301B65942873B (user_library_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE favorite_books_ebook (favorite_books_id INT NOT NULL, ebook_id INT NOT NULL, INDEX IDX_15B182B776E71D49 (ebook_id), INDEX IDX_15B182B7D78FB4D1 (favorite_books_id), PRIMARY KEY(favorite_books_id, ebook_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE favorite_books_user (favorite_books_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B0D1949BA76ED395 (user_id), INDEX IDX_B0D1949BD78FB4D1 (favorite_books_id), PRIMARY KEY(favorite_books_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_library (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, UNIQUE INDEX UNIQ_F98D86B6A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_library_ebook (user_library_id INT NOT NULL, ebook_id INT NOT NULL, INDEX IDX_A07A0C7276E71D49 (ebook_id), INDEX IDX_A07A0C725942873B (user_library_id), PRIMARY KEY(user_library_id, ebook_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE blog_post ADD CONSTRAINT FK_BA5AE01D9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE993051 FOREIGN KEY (blog_post_id_id) REFERENCES blog_post (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE favorite_books ADD CONSTRAINT FK_FC9301B65942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE favorite_books_ebook ADD CONSTRAINT FK_15B182B776E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_ebook ADD CONSTRAINT FK_15B182B7D78FB4D1 FOREIGN KEY (favorite_books_id) REFERENCES favorite_books (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_user ADD CONSTRAINT FK_B0D1949BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_books_user ADD CONSTRAINT FK_B0D1949BD78FB4D1 FOREIGN KEY (favorite_books_id) REFERENCES favorite_books (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library ADD CONSTRAINT FK_F98D86B6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE user_library_ebook ADD CONSTRAINT FK_A07A0C725942873B FOREIGN KEY (user_library_id) REFERENCES user_library (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_library_ebook ADD CONSTRAINT FK_A07A0C7276E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY FK_5F9E962A9D86650F');
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY FK_5F9E962AD80868CE');
        $this->addSql('DROP TABLE comments');
        $this->addSql('ALTER TABLE ebook DROP average_rating');
        $this->addSql('ALTER TABLE user DROP token_reset, DROP token_expires');
    }
}
