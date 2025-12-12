import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import { useUserStore } from '@/app/stores'

export const UserModal: React.FC = () => {
  const showUserModal = useUserStore((state) => state.showUserModal)
  const setShowUserModal = useUserStore((state) => state.setShowUserModal)
  const selectedUser = useUserStore((state) => state.selectedUser)
  const loading = useUserStore((state) => state.loading)
  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : selectedUser ? (
          <div className="space-y-4">
            <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>
            <div className="space-y-2">
              {selectedUser.firstName && selectedUser.lastName && (
                <p>
                  <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
                </p>
              )}
              {selectedUser.age && (
                <p>
                  <strong>나이:</strong> {selectedUser.age}
                </p>
              )}
              {selectedUser.email && (
                <p>
                  <strong>이메일:</strong> {selectedUser.email}
                </p>
              )}
              {selectedUser.phone && (
                <p>
                  <strong>전화번호:</strong> {selectedUser.phone}
                </p>
              )}
              {selectedUser.address && (
                <p>
                  <strong>주소:</strong> {selectedUser.address.address}, {selectedUser.address.city}, {selectedUser.address.state}
                </p>
              )}
              {selectedUser.company && (
                <p>
                  <strong>직장:</strong> {selectedUser.company.name} - {selectedUser.company.title}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
