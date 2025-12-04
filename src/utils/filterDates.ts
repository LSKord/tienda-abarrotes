import type { TransactionModel } from "../models/transactionModel";


const getDateFilter = ( date :string,list:TransactionModel[]) => {
  const today = new Date();
  let startDate;

  switch (date) {
    case "yearly":
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    case "monthly":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "weekly": {
      const dayOfWeek = today.getDay();
      const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - difference
      );
      break;
    }

    default:
      startDate = today;
      break;
  }

  return list.filter((t)=>{
      const ticketDate = new Date(t.fechaVenta);
      return ticketDate >= startDate && ticketDate<=today;
    })
};

export default getDateFilter;
