export const formatDateInput = (value:{day:number,month:number,year:number})=>{
    const { day, month, year } = value;
      if (!day || !month || !year) {
        throw new Error('Day, month and year are required for birth date');
      }
      return new Date(year, month - 1, day); // month is 0-based
}

export const formatAppointmentTime = (value:{year:number,month:number,day:number,hours:number,minutes:number})=>{
    const { year, month, day, hours, minutes } = value;
    return new Date(year, month - 1, day, hours, minutes);
}