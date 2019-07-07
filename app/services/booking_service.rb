class BookingService
  def initialize(room_type_id, move_in_date, move_out_date)
    raise 'missing room_type_id' unless room_type_id
    raise 'move_in_date should be a Date' unless move_in_date && move_in_date.class == Date
    raise 'move_out_date should be a Date' unless move_out_date && move_out_date.class == Date
    raise 'move_in_date should not be in the past' if move_in_date < Date.yesterday
    raise 'move in date should be earlier than move out date' if move_out_date <= move_in_date

    @room_type_id = room_type_id
    @move_in_date = move_in_date
    @move_out_date = move_out_date
  end

  def book
    raise 'room not available' unless available
    RoomTypeDate
      .where(room_type_id: @room_type_id)
      .where(date: @move_in_date..(@move_out_date - 1.day)) # excluding the last day
      .update_all(["availability=availability-1"])
    true
  end
  
  private
    def available
      return false unless room_type_dates.size == length_of_stay
      room_type_dates.select { |date| date.availability == 0 }.size == 0
    end
    
    def room_type_dates
      return @room_type_dates if @room_type_dates
      @room_type_dates = RoomTypeDate
        .where(room_type_id: @room_type_id)
        .where(date: @move_in_date..(@move_out_date - 1.day)) # excluding the last day
    end

    def length_of_stay
      @move_out_date - @move_in_date
    end
end