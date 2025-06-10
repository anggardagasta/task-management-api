import {getFormSettings, insertFormSetting, updateFormSetting, deleteFormSetting} from '../services/formSettingService';
import {getCosmosContainer} from '../utils/cosmosDB';
import {Container} from '@azure/cosmos';

// Mock the getCosmosContainer function
jest.mock('../utils/cosmosDB', () => ({
    getCosmosContainer: jest.fn(),
}));

const mockQuery = jest.fn();
const mockCreate = jest.fn();
const mockUpsert = jest.fn();
const mockDelete = jest.fn();
const mockReplace = jest.fn();
const mockRead = jest.fn();

const mockItem = jest.fn(() => ({
    read: mockRead,
    replace: mockReplace,
    delete: mockDelete,
}));

const mockContainer = {
    items: {
        query: mockQuery,
        create: mockCreate,
        upsert: mockUpsert,
        delete: mockDelete,
    },
    item: mockItem,
} as unknown as Container;

describe('Form Setting Service', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getFormSettings', () => {
        it('should return form settings for a given organizationId', async () => {
            const mockFormSettings = [{id: '1', organizationId: 'org1', name: 'Setting 1'}];
            (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
            mockQuery.mockReturnValue({
                fetchAll: jest.fn().mockResolvedValue({resources: mockFormSettings}),
            });

            const result = await getFormSettings('org1');
            expect(result).toEqual(mockFormSettings);
            expect(mockQuery).toHaveBeenCalledWith({
                query: 'SELECT * FROM c WHERE c.organizationId = @organizationId',
                parameters: [{name: '@organizationId', value: 'org1'}],
            });
        });

        it('should return an empty array if no form settings are found', async () => {
            (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
            mockQuery.mockReturnValue({
                fetchAll: jest.fn().mockResolvedValue({resources: []}),
            });

            const result = await getFormSettings('org2');
            expect(result).toEqual([]);
        });
    });

    describe('insertFormSetting', () => {
        it('should insert a new form setting', async () => {
            const newFormSetting = {id: 'new-id', organizationId: 'org1', name: 'New Form Setting', fields: []};
            const createdFormSetting = {
                ...newFormSetting,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
            mockCreate.mockResolvedValue({resource: createdFormSetting});

            const result = await insertFormSetting(newFormSetting);
            expect(result).toEqual(createdFormSetting);
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining(newFormSetting));
        });
    });

    describe('updateFormSetting', () => {
        it('should update an existing form setting', async () => {
            const formSettingId = '1';
            const organizationId = 'org1';
            const updatedFormSettingData = {name: 'Updated Form Setting'};
            const existingFormSetting = {
                id: formSettingId,
                organizationId: organizationId,
                name: 'Old Setting',
                fields: []
            };
            const upsertedFormSetting = {
                ...existingFormSetting, ...updatedFormSettingData,
                updatedAt: new Date().toISOString()
            };

            (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
            mockRead.mockResolvedValue({resource: {id: '1', organizationId: 'org1', name: 'form', fields: []}});
            mockReplace.mockResolvedValue({resource: upsertedFormSetting});

            const result = await updateFormSetting(formSettingId, updatedFormSettingData);
            expect(result).toEqual(upsertedFormSetting);
            expect(mockReplace).toHaveBeenCalledWith(expect.objectContaining(updatedFormSettingData));
        });
    });

    describe('deleteFormSetting', () => {
        it('should delete a form setting', async () => {
            const formSettingId = '123';
            const organizationId = 'org1';
            (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
            mockDelete.mockResolvedValue({});

            await deleteFormSetting(formSettingId, organizationId);
            expect(mockItem).toHaveBeenCalledWith(formSettingId, organizationId);
        });
    });
});