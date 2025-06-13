'use client'
import Algorithms from '@/components/algorithms/Algorithms'
import ProtectedRoute from '@/components/ProtectedRoute';


export default function Page() {
  return(
    <ProtectedRoute allowedRoles={[1]}>
      <Algorithms />
    </ProtectedRoute>
  )
}