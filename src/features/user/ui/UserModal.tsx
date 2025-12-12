import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import type { User } from '@/entities/user/model'

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  loading?: boolean
}

export const UserModal: React.FC<UserModalProps> = ({ open, onOpenChange, user, loading = false }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : user ? (
          <div className="space-y-4">
            <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{user.username}</h3>
            <div className="space-y-2">
              {user.firstName && user.lastName && (
                <p>
                  <strong>이름:</strong> {user.firstName} {user.lastName}
                </p>
              )}
              {user.age && (
                <p>
                  <strong>나이:</strong> {user.age}
                </p>
              )}
              {user.email && (
                <p>
                  <strong>이메일:</strong> {user.email}
                </p>
              )}
              {user.phone && (
                <p>
                  <strong>전화번호:</strong> {user.phone}
                </p>
              )}
              {user.address && (
                <p>
                  <strong>주소:</strong> {user.address.address}, {user.address.city}, {user.address.state}
                </p>
              )}
              {user.company && (
                <p>
                  <strong>직장:</strong> {user.company.name} - {user.company.title}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
