import { getTasks, insertTask, updateTask, deleteTask, bulkDeleteTasks } from '../services/taskService';
import { getCosmosContainer } from '../utils/cosmosDB';
import {Container, PatchRequestBody} from '@azure/cosmos';

// Mock the getCosmosContainer function
jest.mock('../utils/cosmosDB', () => ({
  getCosmosContainer: jest.fn(),
}));

jest.spyOn(global.console, 'error').mockImplementation(() => {});

const mockQuery = jest.fn();
const mockCreate = jest.fn();
const mockUpsert = jest.fn();
const mockRead = jest.fn();
const mockDelete = jest.fn();
const mockPatch = jest.fn();

const mockItem = jest.fn(() => ({
  read: mockRead,
  delete: mockDelete,
  patch: mockPatch,
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

describe('Task Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (console.error as jest.Mock).mockClear();
  });

  describe('getTasks', () => {
    it('should return tasks with default pagination and no search', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }];
      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: [mockTasks.length] }),
      });
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: mockTasks }),
      });

      const result = await getTasks('org1', '1', '10', null);
      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(mockTasks.length);
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should return tasks with search criteria', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1', priority: 'High' }];
      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: [mockTasks.length] }),
      });
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: mockTasks }),
      });

      const search = { title: 'Task', priority: 'High' };
      const result = await getTasks('org1', '1', '10', search);
      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(mockTasks.length);
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery.mock.calls[0][0].query).toContain('CONTAINS(LOWER(c.title), LOWER(@title)) AND CONTAINS(LOWER(c.priority), LOWER(@priority))');
    });

    it('should handle empty search results', async () => {
      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: [0] }),
      });
      mockQuery.mockReturnValueOnce({
        fetchAll: jest.fn().mockResolvedValue({ resources: [] }),
      });

      const result = await getTasks('org1', '1', '10', { title: 'NonExistent' });
      expect(result.tasks).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('insertTask', () => {
    it('should insert a new task', async () => {
      const newTask = { id: 'new-id', organizationId: 'org1', title: 'New Task', description: 'Description', status: 'Open', priority: 'low', assignee: 'user1' };
      const createdTask = { ...newTask, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockCreate.mockResolvedValue({ resource: createdTask });

      const result = await insertTask(newTask);
      expect(result).toEqual(createdTask);
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining(newTask));
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const organizationId = 'org1';
      const updatedTaskData = [
        { op: 'replace', path: '/title', value: 'Updated Task' },
        { op: 'replace', path: '/description', value: 'Updated Description' }
      ] as PatchRequestBody;
      const existingTask = { id: taskId, organizationId: organizationId, title: 'Old Task', description: 'Old Description', status: 'Open', priority: 'low', assignee: 'user1' };
      const upsertedTask = { ...existingTask, title: 'Updated Task', description: 'Updated Description', updatedAt: new Date().toISOString() };

      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockRead.mockResolvedValue({resource: existingTask});
      mockPatch.mockResolvedValue({ resource: upsertedTask });

      const result = await updateTask(taskId, organizationId, updatedTaskData);
      expect(result).toEqual(upsertedTask);
      expect(mockPatch).toHaveBeenCalledWith(updatedTaskData);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = '123';
      const organizationId = 'org1';
      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      mockRead.mockResolvedValue({resource: {id: '123', organizationId: 'org1', title: 'Task 1'}});
      mockDelete.mockResolvedValue({});

      await deleteTask(taskId, organizationId);
      expect(mockItem).toHaveBeenCalledWith(taskId, organizationId);
    });
  });

  describe('bulkDeleteTasks', () => {
    it('should delete multiple tasks and handle failures gracefully', async () => {
      const taskIds = ['1', '2', '3'];
      const organizationId = 'org1';

      (getCosmosContainer as jest.Mock).mockResolvedValue(mockContainer);
      // Mock successful deletion for task '1' and '3', and a failure for '2'
      mockDelete
        .mockImplementation((id) => {
          if (id === '1' || id === '3') return Promise.resolve({});
          return Promise.reject(new Error('Task not found'));
        });

      await bulkDeleteTasks(taskIds, organizationId);

      expect(mockItem).toHaveBeenCalledTimes(taskIds.length);
      expect(mockItem).toHaveBeenCalledWith('1', organizationId);
      expect(mockItem).toHaveBeenCalledWith('2', organizationId);
      expect(mockItem).toHaveBeenCalledWith('3', organizationId);
    });
  });
});