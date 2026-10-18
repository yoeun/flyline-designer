import { useState } from 'react';
import { toast } from 'sonner';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Field from './Field.jsx';
import { Input } from './Input.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { shareUrl } from '../lib/shareApi.js';

// Sharing the rack: a view-only link that follows the rack as it changes, with a new link or stop sharing.
// busy disables the buttons while a call is out.
export default function ShareDialog({ open, share, busy, onShare, onRotate, onStop, onClose }) {
  const url = share && shareUrl(share.shareId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied.');
    } catch {
      toast('Couldn’t copy the link. Select it and copy it instead.');
    }
  };

  // Stop sharing and New link each ask first, since the current link stops working.
  const [confirming, setConfirming] = useState(null);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your rack</DialogTitle>
          <DialogDescription>
            {share
              ? 'Anyone with this link can see your rack, but not change it. It shows your changes as you save them.'
              : 'Get a view-only link to your rack. People with the link can look but not change anything, and it follows your changes as you save them.'}
          </DialogDescription>
        </DialogHeader>
        {share && (
          <Field label="Link" htmlFor="share-link">
            <div className="flex gap-2">
              <Input id="share-link" readOnly value={url} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 font-mono text-[13px] md:text-[13px]" />
              <Button variant="primary" onClick={copy}>
                Copy
              </Button>
            </div>
          </Field>
        )}
        <DialogFooter className="flex-wrap">
          {share ? (
            <>
              <Button onClick={() => setConfirming('stop')} disabled={busy}>
                Stop sharing
              </Button>
              <Button onClick={() => setConfirming('rotate')} disabled={busy}>
                New link
              </Button>
              <Button onClick={onClose}>Done</Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onShare} disabled={busy}>
                {busy ? 'Sharing…' : 'Get link'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
      <ConfirmDialog
        open={confirming === 'stop'}
        title="Stop sharing your rack?"
        description="The link will stop working for everyone who has it."
        confirmLabel="Stop sharing"
        onConfirm={() => {
          setConfirming(null);
          onStop();
        }}
        onCancel={() => setConfirming(null)}
      />
      <ConfirmDialog
        open={confirming === 'rotate'}
        title="Make a new link?"
        description="The current link will stop working for everyone who has it."
        confirmLabel="New link"
        onConfirm={() => {
          setConfirming(null);
          onRotate();
        }}
        onCancel={() => setConfirming(null)}
      />
    </Dialog>
  );
}
