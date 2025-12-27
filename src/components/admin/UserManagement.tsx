import { useState } from 'react';
import { useUsers, useGrantAdminRole, useRevokeAdminRole } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Shield, Loader2 } from 'lucide-react';

const UserManagement = () => {
  const { user } = useAuth();
  const { data: users, isLoading } = useUsers();
  const grantAdmin = useGrantAdminRole();
  const revokeAdmin = useRevokeAdminRole();

  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const [addDialog, setAddDialog] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  const handleToggleAdmin = (userId: string, isCurrentlyAdmin: boolean) => {
    if (isCurrentlyAdmin) {
      // Show confirmation before revoking
      setRevokeDialog({ open: true, userId });
    } else {
      grantAdmin.mutate(userId);
    }
  };

  const confirmRevoke = () => {
    if (revokeDialog.userId) {
      revokeAdmin.mutate(revokeDialog.userId);
    }
    setRevokeDialog({ open: false, userId: null });
  };

  const handleAddAdmin = () => {
    if (newUserId.trim()) {
      grantAdmin.mutate(newUserId.trim());
      setNewUserId('');
      setAddDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage admin access for users</p>
        </div>
        <Dialog open={addDialog} onOpenChange={setAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
              <DialogDescription>
                Enter the User ID to grant admin access. You can find user IDs in the authentication logs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID (UUID)</Label>
                <Input
                  id="userId"
                  placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} disabled={!newUserId.trim()}>
                Grant Admin Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {users && users.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Admin Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isCurrentUser = u.user_id === user?.id;
                const isAdmin = u.role === 'admin';

                return (
                  <TableRow key={u.user_id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {u.email || 'No email'}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {u.user_id.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="capitalize">{u.role}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={isAdmin}
                        onCheckedChange={() => handleToggleAdmin(u.user_id, isAdmin)}
                        disabled={isCurrentUser}
                        title={isCurrentUser ? "You cannot revoke your own admin access" : ""}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          No admin users found. Add one to get started.
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialog.open} onOpenChange={(open) => setRevokeDialog({ ...revokeDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Admin Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove admin privileges from this user. They will no longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevoke} className="bg-destructive text-destructive-foreground">
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
