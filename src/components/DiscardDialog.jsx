import Button from './Button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Asks before an action throws away unsaved changes to the setup in the designer.
export default function DiscardDialog({ open, name, onDiscard, onCancel }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discard your changes?</DialogTitle>
          <DialogDescription>Your changes to “{name}” aren’t saved to your rack.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel}>Keep editing</Button>
          <Button variant="primary" onClick={onDiscard}>
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
