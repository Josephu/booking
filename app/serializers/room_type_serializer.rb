class RoomTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :average_monthly_rate, :available,
    :move_in_date, :move_out_date

  def average_monthly_rate
    return nil if !move_in_date || !move_out_date
    return nil if room_type_dates.size == 0
    room_type_dates.map(&:rate).reduce(:+) / room_type_dates.size * 30
  end

  def available
    return nil if !move_in_date || !move_out_date
    return false if room_type_dates.size == 0
    room_type_dates.select { |date| date.availability == 0 }.size == 0
  end

  def move_in_date
    @instance_options[:move_in_date]
  end

  def move_out_date
    @instance_options[:move_out_date]
  end

  def room_type_dates
    return @room_type_dates if @room_type_dates
    @room_type_dates = RoomTypeDate
      .where(room_type_id: @object.id)
      .where(date: move_in_date..(move_out_date - 1.day)) # excluding the last day
  end
end
