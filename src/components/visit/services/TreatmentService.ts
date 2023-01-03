import { Card } from '../domain/Card';
import { Treatment } from '../domain/Treatment';
import { TreatmentDTO } from '../useCase/createAppoinment/CreateAppoinmentDTO';

export class TreatmentService {
  matchTreatments(fetchedTreatmens: Treatment[], treatmentsFromRequest: TreatmentDTO[]): Treatment[] {
    const result = treatmentsFromRequest.map((treatmentFromRequest) => {
      const matchTreatment = fetchedTreatmens.find((i) => i.treatmentId.value === treatmentFromRequest.id);

      if (!matchTreatment) throw new Error('Could not find treatment with id: ' + treatmentFromRequest.id);

      const card = treatmentFromRequest.card
        ? Card.create({
            accountId: matchTreatment.accountId,
            isTemplateFilled: true,
            name: treatmentFromRequest.card.name,
            template: treatmentFromRequest.card.template,
          })
        : undefined;

      if (card?.isFailure) throw new Error('Could not create card for treatment: ' + card.error);

      if (card?.isSuccess) matchTreatment.addFilledCard(card.getValue());

      matchTreatment.updateDetails({
        duration: treatmentFromRequest.duration,
        startTime: treatmentFromRequest.startTime,
      });

      return matchTreatment;
    });

    return result;
  }
}
