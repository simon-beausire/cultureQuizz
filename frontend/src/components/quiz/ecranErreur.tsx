import { ButtonUtilitaire } from "../buttonUtilitaire";

type EcranErreurProps = {
  message: string;
  onReessayer: () => void;
  onRetourAccueil: () => void;
};

export function EcranErreur({ message, onReessayer, onRetourAccueil }: EcranErreurProps) {
  return (
    <>
      <div className="jeu__body jeu__body--fin">
        <p className="jeu__erreur">{message}</p>
      </div>

      <div className="jeu__actions jeu__actions--duo">
        <ButtonUtilitaire block icon="↺" onClick={onReessayer}>
          Réessayer
        </ButtonUtilitaire>
        <ButtonUtilitaire block variant="ghost" onClick={onRetourAccueil}>
          Retour à l'accueil
        </ButtonUtilitaire>
      </div>
    </>
  );
}
