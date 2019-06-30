class CreateHotels < ActiveRecord::Migration[5.2]
  def change
    create_table :hotels do |t|
      t.string :name
      t.string :uuid
      t.string :cover_image

      t.timestamps
    end
  end
end
