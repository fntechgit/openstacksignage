export const isSummitEventDataUpdate = (entity_type) => {
    return entity_type === 'Presentation' || entity_type === 'SummitEvent';
}
