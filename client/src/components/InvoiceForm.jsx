import { useForm } from 'react-hook-form';
import { FileText, Calendar, User, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function InvoiceForm({ defaultValues, onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ 
    defaultValues,
    mode: 'onChange'
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Review Invoice Details</h2>
            <p className="text-blue-100">Verify and edit the extracted information</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Number */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Invoice Number</span>
            </label>
            <div className="relative">
              <input
                {...register('invoiceNumber', { 
                  required: 'Invoice number is required',
                  minLength: { value: 1, message: 'Invoice number cannot be empty' }
                })}
                className={`
                  w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none
                  ${errors.invoiceNumber 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }
                `}
                placeholder="Enter invoice number"
              />
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.invoiceNumber && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.invoiceNumber.message}</span>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>Invoice Date</span>
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('date', { 
                  required: 'Date is required'
                })}
                className={`
                  w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none
                  ${errors.date 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-500 focus:bg-green-50'
                  }
                `}
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.date && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.date.message}</span>
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-purple-500" />
              <span>Customer Name</span>
            </label>
            <div className="relative">
              <input
                {...register('customerName', { 
                  required: 'Customer name is required',
                  minLength: { value: 2, message: 'Customer name must be at least 2 characters' }
                })}
                className={`
                  w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none
                  ${errors.customerName 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-purple-500 focus:bg-purple-50'
                  }
                `}
                placeholder="Enter customer name"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.customerName && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.customerName.message}</span>
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Total Amount</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register('totalAmount', { 
                  required: 'Total amount is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                className={`
                  w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none
                  ${errors.totalAmount 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-emerald-500 focus:bg-emerald-50'
                  }
                `}
                placeholder="0.00"
              />
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.totalAmount && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.totalAmount.message}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform
                ${isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Confirm & Get Summary
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>All information will be verified before final processing</span>
        </div>
      </div>
    </div>
  );
}