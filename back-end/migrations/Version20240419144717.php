<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240419144717 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart_items CHANGE ebook_id_id ebook_id INT NOT NULL');
        $this->addSql('ALTER TABLE cart_items ADD CONSTRAINT FK_BEF4844576E71D49 FOREIGN KEY (ebook_id) REFERENCES ebook (id)');
        $this->addSql('CREATE INDEX IDX_BEF4844576E71D49 ON cart_items (ebook_id)');
        $this->addSql('ALTER TABLE ebook DROP ebook_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart_items DROP FOREIGN KEY FK_BEF4844576E71D49');
        $this->addSql('DROP INDEX IDX_BEF4844576E71D49 ON cart_items');
        $this->addSql('ALTER TABLE cart_items CHANGE ebook_id ebook_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE ebook ADD ebook_id INT DEFAULT NULL');
    }
}
