<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240426085157 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE my_library (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, status VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_2B793490A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE my_library_ebook (my_library_id INT NOT NULL, ebook_id INT NOT NULL, INDEX IDX_9C81D1839A14784 (my_library_id), INDEX IDX_9C81D18376E71D49 (ebook_id), PRIMARY KEY(my_library_id, ebook_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE my_library ADD CONSTRAINT FK_2B793490A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE my_library_ebook ADD CONSTRAINT FK_9C81D1839A14784 FOREIGN KEY (my_library_id) REFERENCES my_library (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE my_library_ebook ADD CONSTRAINT FK_9C81D18376E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE my_library DROP FOREIGN KEY FK_2B793490A76ED395');
        $this->addSql('ALTER TABLE my_library_ebook DROP FOREIGN KEY FK_9C81D1839A14784');
        $this->addSql('ALTER TABLE my_library_ebook DROP FOREIGN KEY FK_9C81D18376E71D49');
        $this->addSql('DROP TABLE my_library');
        $this->addSql('DROP TABLE my_library_ebook');
    }
}
